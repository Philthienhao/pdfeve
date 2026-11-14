const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 8888;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.mjs': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

function getLanIp() {
  const interfaces = os.networkInterfaces();
  // Ưu tiên card mạng chính (en0 trên macOS hoặc Ethernet/Wi-Fi trên Windows)
  const priorityAdapters = ['en0', 'en1', 'eth0', 'wlan0', 'Wi-Fi', 'Ethernet'];
  for (const name of priorityAdapters) {
    if (interfaces[name]) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }

  // Quét dải IP nội bộ thông dụng, bỏ qua các card mạng ảo/bridge
  for (const name of Object.keys(interfaces)) {
    if (name.startsWith('bridge') || name.startsWith('utun') || name.startsWith('vbox') || name.startsWith('docker')) continue;
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return '70.0.3.38';
}

const tempFiles = new Map();

// Dọn dẹp tệp tạm quá 15 phút
setInterval(() => {
  const now = Date.now();
  for (const [id, item] of tempFiles.entries()) {
    if (now - item.createdAt > 15 * 60 * 1000) {
      tempFiles.delete(id);
    }
  }
}, 60 * 1000);

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  
  if (parsedUrl.pathname === '/api/lan-ip') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ ip: getLanIp(), port: activePort }));
    return;
  }

  // Chuẩn bị URL tải tệp với Content-Disposition: attachment cho điện thoại iPhone / Android
  if (parsedUrl.pathname === '/api/prepare-download') {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const filename = decodeURIComponent(parsedUrl.searchParams.get('filename') || 'PDFeve_document.pdf');
      const mimeType = parsedUrl.searchParams.get('mimeType') || 'application/pdf';
      const fileId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      
      tempFiles.set(fileId, {
        buffer,
        filename,
        mimeType,
        createdAt: Date.now()
      });

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        success: true,
        fileId,
        downloadUrl: `/api/download/${fileId}/${encodeURIComponent(filename)}`,
        viewUrl: `/api/view/${fileId}/${encodeURIComponent(filename)}`
      }));
    });
    return;
  }

const JSZip = require('jszip');

// Loại bỏ hoàn toàn lớp ảnh scan nền (behindDoc="1") đè dưới văn bản
async function cleanDocxRemoveUnderlyingImages(buffer) {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const docFile = zip.file('word/document.xml');
    if (!docFile) return buffer;

    let xml = await docFile.async('string');

    // Kiểm tra xem tài liệu có chứa văn bản không (<w:t>)
    const textMatches = xml.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const textContent = textMatches.map(m => m.replace(/<[^>]+>/g, '').trim()).join('');
    const hasText = textContent.length > 5;

    if (hasText) {
      // 1. Loại bỏ mọi khối <mc:AlternateContent> chứa ảnh nền (behindDoc="1" hoặc ảnh scan)
      xml = xml.replace(/<mc:AlternateContent>[\s\S]*?<\/mc:AlternateContent>/g, (match) => {
        const isBehind = match.includes('behindDoc="1"') || match.includes('behindDoc="true"');
        const hasPic = match.includes('<pic:pic') || match.includes('<a:blip') || match.includes('<v:imagedata');
        return (isBehind && hasPic) ? '' : match;
      });

      // 2. Loại bỏ mọi khối <w:drawing> độc lập có behindDoc="1" chứa ảnh
      xml = xml.replace(/<w:drawing>[\s\S]*?<\/w:drawing>/g, (match) => {
        const isBehind = match.includes('behindDoc="1"') || match.includes('behindDoc="true"');
        const hasPic = match.includes('<pic:pic') || match.includes('<a:blip');
        return (isBehind && hasPic) ? '' : match;
      });

      // 3. Loại bỏ ảnh VML <w:pict> nền
      xml = xml.replace(/<w:pict>[\s\S]*?<\/w:pict>/g, (match) => {
        return match.includes('<v:imagedata') ? '' : match;
      });

      // 4. Dọn dẹp run rỗng
      xml = xml.replace(/<w:r>\s*(<w:rPr>[\s\S]*?<\/w:rPr>\s*)?<\/w:r>/g, '');
      zip.file('word/document.xml', xml);

      // 5. Dọn dẹp tệp media không còn tham chiếu trong ZIP
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
    console.warn('[cleanDocxRemoveUnderlyingImages] Lỗi lọc ảnh scan nền:', err.message);
    return buffer;
  }
}

  // Chuyển đổi PDF sang Word độ chính xác cao qua Engine giữ nguyên Header & Footer
  if (parsedUrl.pathname === '/api/convert-pdf-to-word') {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const os = require('os');
        const { spawn } = require('child_process');
        const tempDir = os.tmpdir();
        const randomId = Math.random().toString(36).slice(2, 9);
        const tempInPdf = path.join(tempDir, `pdfeve_srv_in_${Date.now()}_${randomId}.pdf`);
        const tempOutDocx = path.join(tempDir, `pdfeve_srv_out_${Date.now()}_${randomId}.docx`);
        fs.writeFileSync(tempInPdf, buffer);

        let scriptPath = path.join(__dirname, 'pdf_to_docx_engine.py');
        if (!fs.existsSync(scriptPath) && process.resourcesPath) {
          const resScript = path.join(process.resourcesPath, 'pdf_to_docx_engine.py');
          if (fs.existsSync(resScript)) scriptPath = resScript;
        }
        if (scriptPath.includes('app.asar')) {
          const tempScript = path.join(tempDir, 'pdfeve_pdf_to_docx_engine.py');
          try {
            const pyContent = fs.readFileSync(scriptPath, 'utf8');
            fs.writeFileSync(tempScript, pyContent, 'utf8');
            scriptPath = tempScript;
          } catch (e) {
            console.warn('[server.js] Lỗi trích xuất script từ asar:', e);
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

          res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Length': docxBuf.length,
            'Access-Control-Allow-Origin': '*'
          });
          res.end(docxBuf);
          return;
        }
      } catch (err) {
        console.warn('[server.js convert-pdf-to-word error]:', err.message);
      }
      res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: 'Engine conversion failed' }));
    });
    return;
  }

  // Tải tệp tin (Kích hoạt hộp thoại tải tệp của Safari / Chrome điện thoại)
  if (parsedUrl.pathname.startsWith('/api/download/')) {
    const parts = parsedUrl.pathname.split('/');
    const fileId = parts[3];
    const item = tempFiles.get(fileId);
    if (!item) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Tệp tin đã hết hạn hoặc không tìm thấy. Vui lòng tạo lại.');
      return;
    }
    const safeAsciiFilename = item.filename.replace(/[^\x20-\x7E]/g, '_');
    res.writeHead(200, {
      'Content-Type': item.mimeType,
      'Content-Length': item.buffer.length,
      'Content-Disposition': `attachment; filename="${safeAsciiFilename}"; filename*=UTF-8''${encodeURIComponent(item.filename)}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(item.buffer);
    return;
  }

  // Xem trực tiếp tệp tin PDF trên trình duyệt di động
  if (parsedUrl.pathname.startsWith('/api/view/')) {
    const parts = parsedUrl.pathname.split('/');
    const fileId = parts[3];
    const item = tempFiles.get(fileId);
    if (!item) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Tệp tin đã hết hạn hoặc không tìm thấy. Vui lòng tạo lại.');
      return;
    }
    const safeAsciiFilename = item.filename.replace(/[^\x20-\x7E]/g, '_');
    res.writeHead(200, {
      'Content-Type': item.mimeType,
      'Content-Length': item.buffer.length,
      'Content-Disposition': `inline; filename="${safeAsciiFilename}"; filename*=UTF-8''${encodeURIComponent(item.filename)}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(item.buffer);
    return;
  }

  let safePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(__dirname, safePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 Not Found - PDFeve');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content);
    }
  });
});

let activePort = PORT;

function startServer(preferredPort = PORT) {
  return new Promise((resolve) => {
    let currentPort = preferredPort;
    const tryListen = () => {
      server.listen(currentPort, '0.0.0.0', () => {
        activePort = currentPort;
        const lanIp = getLanIp();
        console.log(`🚀 PDFeve Server đang chạy tại:`);
        console.log(`   - Cục bộ:     http://localhost:${currentPort}`);
        console.log(`   - Điện thoại: http://${lanIp}:${currentPort}`);
        resolve({ port: activePort, ip: lanIp, server });
      });
    };

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[PDFeve Server] Cổng ${currentPort} đang bận, thử đổi sang cổng ${currentPort + 1}...`);
        currentPort++;
        setTimeout(tryListen, 150);
      } else {
        console.error('[PDFeve Server] Lỗi khởi động:', err);
        resolve({ port: currentPort, ip: getLanIp(), error: err });
      }
    });

    tryListen();
  });
}

// Nếu chạy trực tiếp từ dòng lệnh: node server.js
if (require.main === module) {
  startServer();
}

module.exports = {
  server,
  startServer,
  getLanIp,
  getActivePort: () => activePort
};
