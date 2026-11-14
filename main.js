const { app, BrowserWindow, dialog, ipcMain, shell, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { startServer, getLanIp, getActivePort } = require('./server');

let mainWindow = null;

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png');
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 960,
    minHeight: 640,
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    title: 'PDFeve — Nền tảng Xử lý & Biên tập PDF Đa năng',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: process.platform === 'darwin' ? { x: 16, y: 16 } : undefined,
    backgroundColor: '#0f172a',
    show: false, // Hiện sau khi đã render xong để không bị nháy trắng
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  // Tải trực tiếp giao diện ứng dụng
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Hiển thị mượt mà khi sẵn sàng
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Mở các liên kết ngoài bằng trình duyệt mặc định
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  buildAppMenu();
}

// Menu hệ thống chuyên nghiệp cho macOS & Windows
function buildAppMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: 'Về PDFeve' },
        { type: 'separator' },
        { role: 'services', label: 'Dịch vụ' },
        { type: 'separator' },
        { role: 'hide', label: 'Ẩn PDFeve' },
        { role: 'hideOthers', label: 'Ẩn ứng dụng khác' },
        { role: 'unhide', label: 'Hiện tất cả' },
        { type: 'separator' },
        { role: 'quit', label: 'Thoát PDFeve' }
      ]
    }] : []),
    {
      label: 'Tệp tin',
      submenu: [
        {
          label: 'Mở tệp PDF...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            if (mainWindow) {
              const res = await dialog.showOpenDialog(mainWindow, {
                title: 'Chọn tệp PDF để xử lý',
                filters: [{ name: 'Tệp PDF', extensions: ['pdf'] }],
                properties: ['openFile', 'multiSelections']
              });
              if (!res.canceled && res.filePaths.length > 0) {
                mainWindow.webContents.send('menu:openFiles', res.filePaths);
              }
            }
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close', label: 'Đóng cửa sổ' } : { role: 'quit', label: 'Thoát' }
      ]
    },
    {
      label: 'Chỉnh sửa',
      submenu: [
        { role: 'undo', label: 'Hoàn tác' },
        { role: 'redo', label: 'Làm lại' },
        { type: 'separator' },
        { role: 'cut', label: 'Cắt' },
        { role: 'copy', label: 'Sao chép' },
        { role: 'paste', label: 'Dán' },
        { role: 'selectAll', label: 'Chọn tất cả' }
      ]
    },
    {
      label: 'Xem',
      submenu: [
        { role: 'reload', label: 'Tải lại trang' },
        { role: 'forceReload', label: 'Làm mới hoàn toàn' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Kích thước mặc định' },
        { role: 'zoomIn', label: 'Phóng to' },
        { role: 'zoomOut', label: 'Thu nhỏ' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toàn màn hình' }
      ]
    },
    {
      label: 'Trợ giúp',
      submenu: [
        {
          label: 'Tìm kiếm công cụ (⌘K)',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            mainWindow?.webContents.send('shortcut:search');
          }
        },
        { type: 'separator' },
        {
          label: 'Trang chủ PDFeve',
          click: () => shell.openExternal('https://github.com')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC: Hộp thoại chọn file gốc của hệ điều hành
ipcMain.handle('dialog:selectFiles', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: options.title || 'Chọn tệp tin',
    properties: options.properties || ['openFile', 'multiSelections'],
    filters: options.filters || [
      { name: 'Tất cả tệp hỗ trợ', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'docx', 'xlsx', 'pptx', 'txt', 'html', 'md'] },
      { name: 'Tất cả tệp (*.*)', extensions: ['*'] }
    ]
  });

  if (result.canceled) return { canceled: true, files: [] };

  const files = result.filePaths.map(filePath => {
    const buffer = fs.readFileSync(filePath);
    return {
      name: path.basename(filePath),
      path: filePath,
      size: buffer.length,
      buffer: Array.from(buffer)
    };
  });

  return { canceled: false, files };
});

// IPC: Hộp thoại lưu file trực tiếp ra ổ cứng (Native Save Dialog)
ipcMain.handle('dialog:saveFile', async (event, { buffer, filename }) => {
  const ext = path.extname(filename).replace('.', '') || 'pdf';
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Lưu tệp tin xuất bản',
    defaultPath: filename,
    filters: [
      { name: `Tệp ${ext.toUpperCase()}`, extensions: [ext] },
      { name: 'Tất cả các tệp', extensions: ['*'] }
    ]
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  try {
    const uint8Array = new Uint8Array(buffer);
    await fs.promises.writeFile(result.filePath, uint8Array);
    return {
      canceled: false,
      success: true,
      filePath: result.filePath,
      filename: path.basename(result.filePath)
    };
  } catch (err) {
    return { canceled: false, success: false, error: err.message };
  }
});

// IPC: Mở thư mục chứa file vừa lưu
ipcMain.handle('shell:showInFolder', (event, filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath);
    return true;
  }
  return false;
});

// IPC: Lấy thông tin ứng dụng
ipcMain.handle('app:getInfo', () => {
  return {
    name: 'PDFeve',
    version: app.getVersion(),
    platform: process.platform,
    isMac: process.platform === 'darwin',
    isWindows: process.platform === 'win32',
    appPath: app.getAppPath()
  };
});

// IPC: Lấy thông tin IP mạng LAN và cổng nội bộ phục vụ quét mã QR từ điện thoại
ipcMain.handle('server:getLanInfo', () => {
  const ip = getLanIp();
  const port = getActivePort();
  return {
    ip,
    port,
    url: `http://${ip}:${port}`
  };
});

const JSZip = require('jszip');

// Loại bỏ hoàn toàn lớp ảnh scan nền (behindDoc="1") đè dưới văn bản
async function cleanDocxRemoveUnderlyingImages(buffer) {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const docFile = zip.file('word/document.xml');
    if (!docFile) return buffer;

    let xml = await docFile.async('string');
    const textMatches = xml.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const textContent = textMatches.map(m => m.replace(/<[^>]+>/g, '').trim()).join('');
    const hasText = textContent.length > 5;

    if (hasText) {
      xml = xml.replace(/<mc:AlternateContent>[\s\S]*?<\/mc:AlternateContent>/g, (match) => {
        const isBehind = match.includes('behindDoc="1"') || match.includes('behindDoc="true"');
        const hasPic = match.includes('<pic:pic') || match.includes('<a:blip') || match.includes('<v:imagedata');
        return (isBehind && hasPic) ? '' : match;
      });

      xml = xml.replace(/<w:drawing>[\s\S]*?<\/w:drawing>/g, (match) => {
        const isBehind = match.includes('behindDoc="1"') || match.includes('behindDoc="true"');
        const hasPic = match.includes('<pic:pic') || match.includes('<a:blip');
        return (isBehind && hasPic) ? '' : match;
      });

      xml = xml.replace(/<w:pict>[\s\S]*?<\/w:pict>/g, (match) => {
        return match.includes('<v:imagedata') ? '' : match;
      });

      xml = xml.replace(/<w:r>\s*(<w:rPr>[\s\S]*?<\/w:rPr>\s*)?<\/w:r>/g, '');
      zip.file('word/document.xml', xml);

      const relsFile = zip.file('word/_rels/document.xml.rels');
      if (relsFile) {
        let relsXml = await relsFile.async('string');
        const relMatches = relsXml.match(/<Relationship[^>]+>/g) || [];
        const usedRelIds = new Set();
        const rIdMatches = xml.match(/r:embed="([^"]+)"|r:id="([^"]+)"/g) || [];
        for (const m of rIdMatches) {
          const val = m.split('"')[1];
          if (val) usedRelIds.add(val);
        }

        for (const relTag of relMatches) {
          const idMatch = relTag.match(/Id="([^"]+)"/);
          const targetMatch = relTag.match(/Target="([^"]+)"/);
          if (idMatch && targetMatch) {
            const rId = idMatch[1];
            const target = targetMatch[1];
            if (!usedRelIds.has(rId) && target.startsWith('media/')) {
              zip.remove('word/' + target);
              relsXml = relsXml.replace(relTag, '');
            }
          }
        }
        zip.file('word/_rels/document.xml.rels', relsXml);
      }
    }

    return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  } catch (err) {
    console.warn('[main.js cleanDocx error]:', err.message);
    return buffer;
  }
}

// IPC: Chuyển đổi PDF sang Word độ chính xác cao 100% qua Engine giữ nguyên Header & Footer
ipcMain.handle('engine:pdfToWord', async (event, { buffer, title }) => {
  try {
    const inputBuf = Buffer.from(buffer);
    const tempDir = app.getPath('temp');
    const randomId = Math.random().toString(36).slice(2, 9);
    const tempInPdf = path.join(tempDir, `pdfeve_in_${Date.now()}_${randomId}.pdf`);
    const tempOutDocx = path.join(tempDir, `pdfeve_out_${Date.now()}_${randomId}.docx`);
    fs.writeFileSync(tempInPdf, inputBuf);

    let scriptPath = path.join(__dirname, 'pdf_to_docx_engine.py');
    if (!fs.existsSync(scriptPath) && process.resourcesPath) {
      const resScript = path.join(process.resourcesPath, 'pdf_to_docx_engine.py');
      if (fs.existsSync(resScript)) scriptPath = resScript;
    }
    // Nếu ứng dụng đang đóng gói dưới dạng app.asar, Python không thể đọc file trực tiếp từ asar
    // Trích xuất script ra tempDir để Python thực thi độc lập 100%
    if (scriptPath.includes('app.asar')) {
      const tempScript = path.join(tempDir, 'pdfeve_pdf_to_docx_engine.py');
      try {
        const pyContent = fs.readFileSync(scriptPath, 'utf8');
        fs.writeFileSync(tempScript, pyContent, 'utf8');
        scriptPath = tempScript;
      } catch (e) {
        console.warn('Lỗi trích xuất script từ asar:', e);
      }
    }

    await new Promise((resolve, reject) => {
      const py = spawn('python3', [scriptPath, tempInPdf, tempOutDocx]);
      let stderr = '';
      py.stderr.on('data', d => { stderr += d; });
      py.on('close', code => {
        if (code === 0 && fs.existsSync(tempOutDocx)) resolve();
        else reject(new Error(stderr || `Python engine exit code ${code}`));
      });
      py.on('error', reject);
    });

    if (fs.existsSync(tempOutDocx)) {
      const docxBuf = fs.readFileSync(tempOutDocx);
      try { fs.unlinkSync(tempInPdf); } catch (e) {}
      try { fs.unlinkSync(tempOutDocx); } catch (e) {}
      return Array.from(new Uint8Array(docxBuf));
    }
  } catch (err) {
    console.warn('[PDFeve Main Engine Error]:', err.message);
  }
  return null;
});

// ========================================================
// HỆ THỐNG TỰ ĐỘNG CẬP NHẬT PHIÊN BẢN (AUTO-UPDATER GITHUB)
// ========================================================
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let isManualCheck = false;

const devUpdateConfig = path.join(__dirname, 'dev-app-update.yml');
if (!app.isPackaged && fs.existsSync(devUpdateConfig)) {
  autoUpdater.updateConfigPath = devUpdateConfig;
}

function sendUpdaterEvent(data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:event', data);
  }
}

autoUpdater.on('checking-for-update', () => {
  if (isManualCheck) {
    sendUpdaterEvent({ status: 'checking', message: 'Đang kết nối máy chủ GitHub Releases...' });
  }
});

autoUpdater.on('update-available', (info) => {
  isManualCheck = false;
  sendUpdaterEvent({
    status: 'available',
    currentVersion: app.getVersion(),
    targetVersion: info.version,
    releaseDate: info.releaseDate,
    releaseNotes: info.releaseNotes || 'Bản vá sửa lỗi và nâng cấp hiệu năng cho PDFeve.',
    message: `Đã có phiên bản mới v${info.version}!`
  });
});

autoUpdater.on('update-not-available', (info) => {
  if (isManualCheck) {
    sendUpdaterEvent({
      status: 'not-available',
      currentVersion: app.getVersion(),
      message: `Bạn đang sử dụng phiên bản mới nhất (v${app.getVersion()})!`
    });
  }
  isManualCheck = false;
});

autoUpdater.on('error', (err) => {
  const errMsg = err?.message || String(err);
  console.warn('[AutoUpdater Warning]:', errMsg);
  if (isManualCheck) {
    const isNotFound = errMsg.includes('404') || errMsg.includes('releases.atom') || errMsg.includes('Cannot find');
    sendUpdaterEvent({
      status: 'error',
      isNotFound,
      currentVersion: app.getVersion(),
      message: isNotFound 
        ? 'Kho lưu trữ GitHub Releases chưa được khởi tạo hoặc chưa có bản phát hành.' 
        : 'Không thể kết nối đến máy chủ cập nhật GitHub (Kiểm tra lại kết nối mạng).'
    });
  }
  isManualCheck = false;
});

autoUpdater.on('download-progress', (progressObj) => {
  sendUpdaterEvent({
    status: 'downloading',
    percent: Math.round(progressObj.percent || 0),
    bytesPerSecond: progressObj.bytesPerSecond || 0,
    transferred: progressObj.transferred || 0,
    total: progressObj.total || 0,
    message: `Đang tải bản cập nhật ngầm: ${Math.round(progressObj.percent || 0)}%`
  });
});

autoUpdater.on('update-downloaded', (info) => {
  sendUpdaterEvent({
    status: 'downloaded',
    version: info.version,
    message: `Đã tải xong bản cập nhật v${info.version}. Sẵn sàng cài đặt!`
  });
});

ipcMain.handle('updater:check', async () => {
  isManualCheck = true;
  try {
    const resUpdateConfig = path.join(process.resourcesPath, 'app-update.yml');
    const devCfg = path.join(__dirname, 'dev-app-update.yml');
    if (!app.isPackaged && !fs.existsSync(devCfg) && !fs.existsSync(resUpdateConfig)) {
      sendUpdaterEvent({
        status: 'dev-mode',
        currentVersion: app.getVersion(),
        message: `Đang chạy mã nguồn Dev (v${app.getVersion()}). Tính năng Auto-Update thực tế sẽ chạy khi đóng gói phát hành.`
      });
      return { success: true, devMode: true, version: app.getVersion() };
    }
    const result = await autoUpdater.checkForUpdates();
    return { success: true, updateInfo: result?.updateInfo };
  } catch (err) {
    const errMsg = err?.message || String(err);
    const isNotFound = errMsg.includes('404') || errMsg.includes('releases.atom') || errMsg.includes('Cannot find');
    sendUpdaterEvent({
      status: 'error',
      isNotFound,
      currentVersion: app.getVersion(),
      message: isNotFound 
        ? 'Kho lưu trữ GitHub Releases chưa được khởi tạo hoặc chưa có bản phát hành.' 
        : (err.message || 'Lỗi khi kết nối GitHub Releases.')
    });
    isManualCheck = false;
    return { success: false, error: err.message };
  }
});

ipcMain.handle('updater:download', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('updater:install', () => {
  autoUpdater.quitAndInstall();
});

// Khởi chạy vòng đời ứng dụng
app.whenReady().then(async () => {
  if (process.platform === 'darwin' && app.dock) {
    const dockIcon = path.join(__dirname, 'assets', 'icon.png');
    if (fs.existsSync(dockIcon)) {
      try {
        app.dock.setIcon(dockIcon);
      } catch (e) {}
    }
  }

  // Tự động khởi động máy chủ HTTP nội bộ trong mạng LAN phục vụ kết nối quét mã QR từ điện thoại
  try {
    await startServer(8888);
  } catch (err) {
    console.warn('[PDFeve Main] Lỗi khởi động server nội bộ:', err);
  }

  createWindow();

  // Kiểm tra cập nhật ngầm sau khi mở ứng dụng 4 giây (chỉ chạy khi có cấu hình updater)
  const resUpdateConfig = path.join(process.resourcesPath, 'app-update.yml');
  const devCfg = path.join(__dirname, 'dev-app-update.yml');
  if ((app.isPackaged && fs.existsSync(resUpdateConfig)) || (!app.isPackaged && fs.existsSync(devCfg))) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(e => console.warn('[AutoUpdater Check]:', e.message));
    }, 4000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
