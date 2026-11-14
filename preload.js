const { contextBridge, ipcRenderer } = require('electron');

// Cầu nối bảo mật an toàn giữa Giao diện Web và Hệ điều hành (macOS / Windows)
contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  platform: process.platform,

  // Mở hộp thoại chọn tệp gốc của hệ điều hành (Finder trên Mac / Explorer trên Windows)
  selectFiles: (options = {}) => ipcRenderer.invoke('dialog:selectFiles', options),

  // Lưu trực tiếp file ra ổ cứng không qua trình duyệt (Native Save Dialog)
  saveFile: (dataBuffer, defaultFilename = 'PDFeve_document.pdf') => {
    return ipcRenderer.invoke('dialog:saveFile', {
      buffer: Array.from(new Uint8Array(dataBuffer)),
      filename: defaultFilename
    });
  },

  // Mở thư mục chứa file vừa lưu
  showInFolder: (filePath) => ipcRenderer.invoke('shell:showInFolder', filePath),

  // Lấy thông tin ứng dụng
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),

  // Chuyển đổi PDF sang Word độ chính xác cao qua Engine
  convertPdfToWord: (buffer, title) => ipcRenderer.invoke('engine:pdfToWord', { buffer, title }),

  // Lấy thông tin IP mạng LAN và cổng nội bộ phục vụ quét mã QR từ điện thoại
  getLanInfo: () => ipcRenderer.invoke('server:getLanInfo'),

  // Hệ thống Tự động cập nhật phiên bản (Auto-Update qua GitHub Releases)
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  downloadUpdate: () => ipcRenderer.invoke('updater:download'),
  installUpdate: () => ipcRenderer.invoke('updater:install'),
  onUpdaterEvent: (callback) => {
    ipcRenderer.on('updater:event', (event, data) => callback(data));
  }
});
