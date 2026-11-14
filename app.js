import { CATEGORIES, TOOLS_DATA } from './tools-data.js';
import { pdfEngine } from './pdf-engine.js';
import { toolExecutor } from './tool-executor.js';

// SVG Icon Mapping cho các công cụ
const ICONS = {
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
  scissors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
  move: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
  'rotate-cw': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>',
  layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
  'file-plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
  'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
  'image-plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline><line x1="12" y1="8" x2="12" y2="12"></line><line x1="10" y1="10" x2="14" y2="10"></line></svg>',
  images: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 22H4a2 2 0 0 1-2-2V6"></path><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"></path><circle cx="12" cy="8" r="2"></circle><rect width="16" height="16" x="6" y="2" rx="2"></rect></svg>',
  sheet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>',
  'scan-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M7 8h10"></path><path d="M7 12h10"></path><path d="M7 16h6"></path></svg>',
  'file-image': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><circle cx="10" cy="12" r="2"></circle><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L8 22"></path></svg>',
  type: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  presentation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h20"></path><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path><path d="m7 21 5-5 5 5"></path></svg>',
  smartphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
  'align-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>',
  'edit-3': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>',
  signature: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 16-4 4-5-5-3 3-4-4"></path><path d="M14 6h7v7"></path><path d="M3 21h18"></path></svg>',
  stamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 22h14"></path><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17h16v-1.5c0-.66-.26-1.3-.73-1.77Z"></path><path d="M14 13V8.5C14 7.12 12.88 6 11.5 6S9 7.12 9 8.5V13"></path></svg>',
  'list-ordered': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>',
  'panel-top': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line></svg>',
  crop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"></path><path d="M18 22V8a2 2 0 0 0-2-2H2"></path></svg>',
  'check-square': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
  'minimize-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
  unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>',
  'shield-check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>',
  'eye-off': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>',
  'badge-check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
  default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>'
};

// Icon biểu tượng riêng cho từng Category Capsule
const CATEGORY_ICONS = {
  all: '⚡',
  organize: '🗂',
  from_pdf: '📤',
  to_pdf: '📥',
  edit: '✍️',
  optimize: '🚀',
  security: '🛡'
};

function getIconSvg(iconName) {
  return ICONS[iconName] || ICONS.default;
}

// Trạng thái ứng dụng
const state = {
  currentCategory: 'all',
  searchQuery: '',
  expandedSections: new Set(),
  activeTool: null,
  uploadedFiles: [],
  theme: (localStorage.getItem('pdfeve-theme') || 'light') || 'light',
  signaturePad: {
    isDrawing: false,
    hasContent: false
  },
  insertImage: null,
  cameraStream: null,
  cameraCapturedPages: [],
  cameraFacingMode: 'environment'
};

// Khởi chạy ứng dụng an toàn cho mọi trình duyệt (Safari, Chrome, Firefox, Mobile)
function bootApp() {
  try {
    initTheme();
    pdfEngine.init();
    renderFilterTabs();
    renderSections();
    setupEventListeners();
    setupKeyboardShortcuts();
    setupAutoUpdater();
    checkUrlHash();
    checkInAppBrowser();
  } catch (err) {
    console.error('Lỗi khi khởi chạy PDFeve:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  // DOM đã sẵn sàng (thường xảy ra với ES Modules trên Safari / Chrome di động)
  bootApp();
}

window.addEventListener('hashchange', checkUrlHash);

function checkUrlHash() {
  const hash = window.location.hash.replace('#', '').trim();
  if (hash) {
    const tool = TOOLS_DATA.find(t => t.id === hash);
    if (tool && (!state.activeTool || state.activeTool.id !== tool.id)) {
      openToolModal(tool.id);
    }
  }
}

// 1. KHỞI TẠO VÀ CHUYỂN ĐỔI GIAO DIỆN DARK/LIGHT
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('pdfeve-theme', state.theme);
  updateThemeIcon();
  showToast(`Đã chuyển sang chế độ ${state.theme === 'dark' ? 'Giao diện Tối 🌙' : 'Giao diện Sáng ☀️'}`, 'info');
}

function updateThemeIcon() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  if (state.theme === 'dark') {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.title = 'Chuyển sang giao diện Sáng';
  } else {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    btn.title = 'Chuyển sang giao diện Tối';
  }
}

// 2. RENDER BỘ LỌC DANH MỤC DẠNG SEGMENTED CAPSULES
function renderFilterTabs() {
  const container = document.getElementById('filter-tabs-container');
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="category-capsule ${cat.id === state.currentCategory ? 'active' : ''}" data-category="${cat.id}">
      <span class="capsule-icon">${CATEGORY_ICONS[cat.id] || '📄'}</span>
      <span>${cat.name}</span>
      <span class="category-count">${cat.count}</span>
    </button>
  `).join('');

  container.querySelectorAll('.category-capsule').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.category;
      setCategory(catId);
    });
  });
}

function setCategory(catId) {
  state.currentCategory = catId;
  document.querySelectorAll('.category-capsule').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === catId);
  });
  renderSections();
}

// ========================================================
// TÌM KIẾM SIÊU NHẠY & ĐỀ XUẤT THÔNG MINH (SMART FUZZY & SYNONYMS)
// ========================================================

const VIETNAMESE_SYNONYMS = {
  'them': ['chen', 'add', 'insert', 'gan', 'dua', 'dat', 'nhung', 'bo sung'],
  'chen': ['them', 'add', 'insert', 'gan', 'dua', 'dat', 'nhung', 'bo sung'],
  'anh': ['hinh', 'image', 'photo', 'picture', 'png', 'jpg', 'jpeg', 'do hoa', 'logo', 'con dau'],
  'hinh': ['anh', 'image', 'photo', 'picture', 'png', 'jpg', 'logo'],
  'logo': ['anh', 'hinh', 'dau', 'watermark'],
  'gop': ['ghep', 'noi', 'merge', 'combine', 'lien ket', 'so le'],
  'ghep': ['gop', 'noi', 'merge', 'combine', 'lien ket'],
  'noi': ['gop', 'ghep', 'merge'],
  'tach': ['chia', 'cat', 'split', 'trich', 'extract', 'phan chia', 'le', 'chan', 'don'],
  'chia': ['tach', 'cat', 'split', 'trich', 'extract', 'phan chia'],
  'cat': ['tach', 'chia', 'crop', 'xe', 'xen', 'le'],
  'trich': ['tach', 'trich xuat', 'lay', 'extract'],
  'doi': ['chuyen', 'convert', 'sang', 'to', 'xuat'],
  'chuyen': ['doi', 'convert', 'sang', 'to', 'xuat'],
  'sang': ['chuyen', 'doi', 'to', 'convert'],
  'ky': ['chu ky', 'sign', 'signature', 'dong moc', 'xac thuc', 'token'],
  'chu ky': ['ky', 'sign', 'signature'],
  'xoa': ['bo', 'loai bo', 'delete', 'remove', 'huy'],
  'nen': ['giam dung luong', 'compress', 'shrink', 'nhe', 'toi uu', 'bop'],
  'giam': ['nen', 'compress', 'shrink', 'ha', 'bop'],
  'xoay': ['lat', 'rotate', 'flip', 'nguoc', 'chieu', 'nghieng'],
  'lat': ['xoay', 'rotate', 'flip', 'nguoc'],
  'khoa': ['mat khau', 'bao ve', 'password', 'protect', 'lock', 'encrypt', 'bao mat', 'quyen'],
  'mat khau': ['khoa', 'password', 'protect', 'ma'],
  'mo khoa': ['unlock', 'bo mat khau', 'giai ma', 'pha khoa'],
  'dong dau': ['watermark', 'dau mo', 'chim', 'dau ban quyen', 'con dau', 'dong moc'],
  'dau mo': ['dong dau', 'watermark', 'chim'],
  'watermark': ['dong dau', 'dau mo', 'chim'],
  'so trang': ['danh so', 'page number', 'stt', 'trang'],
  'danh so': ['so trang', 'page number', 'stt'],
  'chu': ['van ban', 'text', 'word', 'doc', 'docx', 'font', 'noi dung'],
  'van ban': ['chu', 'text', 'word', 'doc', 'docx', 'txt'],
  'bang': ['excel', 'xlsx', 'csv', 'tinh', 'sheet'],
  'excel': ['bang', 'xlsx', 'csv', 'sheet'],
  'trang': ['page', 'pages', 'to'],
  'chan': ['even', 'chan le'],
  'le': ['odd', 'chan le']
};

function removeVietnameseTones(str) {
  if (!str) return '';
  str = String(str);
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str.toLowerCase().trim();
}

function scoreToolMatch(tool, rawQuery) {
  if (!rawQuery) return 1;
  const queryClean = rawQuery.trim().toLowerCase();
  const queryNoTone = removeVietnameseTones(queryClean);
  const queryWords = queryNoTone.split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return 1;

  const nameClean = tool.name.toLowerCase();
  const nameNoTone = removeVietnameseTones(nameClean);
  const descClean = tool.desc.toLowerCase();
  const descNoTone = removeVietnameseTones(descClean);
  const catClean = (tool.categoryName || '').toLowerCase();
  const catNoTone = removeVietnameseTones(catClean);
  const idClean = tool.id.toLowerCase();

  let score = 0;

  // 1. Khớp nguyên cụm từ (cả có dấu và không dấu)
  if (nameClean === queryClean || nameNoTone === queryNoTone) score += 120;
  else if (nameClean.startsWith(queryClean) || nameNoTone.startsWith(queryNoTone)) score += 90;
  else if (nameClean.includes(queryClean) || nameNoTone.includes(queryNoTone)) score += 70;

  if (descClean.includes(queryClean) || descNoTone.includes(queryNoTone)) score += 40;

  // 2. Khớp từng từ khóa độc lập (Token-based & từ đồng nghĩa)
  let matchedWordCount = 0;
  for (const word of queryWords) {
    let wordMatched = false;

    // A. Khớp trực tiếp trong tên
    if (nameNoTone.includes(word)) {
      score += 25;
      wordMatched = true;
    } 
    // B. Khớp trực tiếp trong mô tả
    else if (descNoTone.includes(word)) {
      score += 16;
      wordMatched = true;
    } 
    // C. Khớp trong danh mục hoặc id
    else if (catNoTone.includes(word) || idClean.includes(word)) {
      score += 10;
      wordMatched = true;
    }

    // D. Tra từ điển đồng nghĩa nếu chưa khớp trực tiếp
    if (!wordMatched && VIETNAMESE_SYNONYMS[word]) {
      const syns = VIETNAMESE_SYNONYMS[word];
      for (const syn of syns) {
        const synNoTone = removeVietnameseTones(syn);
        if (nameNoTone.includes(synNoTone)) {
          score += 22;
          wordMatched = true;
          break;
        } else if (descNoTone.includes(synNoTone)) {
          score += 14;
          wordMatched = true;
          break;
        }
      }
    }

    if (wordMatched) matchedWordCount++;
  }

  // Thưởng điểm cao nếu khớp toàn bộ các từ trong cụm tìm kiếm
  if (matchedWordCount === queryWords.length && queryWords.length > 1) {
    score += 45;
  }

  // Điều kiện hiển thị
  if (queryWords.length === 1 && matchedWordCount < 1) return 0;
  if (queryWords.length > 1 && matchedWordCount === 0) return 0;

  return score;
}

let activeSuggestionIndex = -1;

function updateSearchSuggestions(rawQuery) {
  const dropdown = document.getElementById('search-suggestions-dropdown');
  if (!dropdown) return;

  const query = rawQuery ? rawQuery.trim() : '';
  if (!query) {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
    activeSuggestionIndex = -1;
    return;
  }

  const scored = TOOLS_DATA
    .map(tool => ({ tool, score: scoreToolMatch(tool, query) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scored.length === 0) {
    dropdown.innerHTML = `
      <div style="padding: 14px 12px; text-align: center; color: var(--text-muted); font-size: 13px;">
        Không tìm thấy gợi ý cho "<strong>${escapeHtml(query)}</strong>"
      </div>
    `;
    dropdown.style.display = 'block';
    return;
  }

  dropdown.innerHTML = `
    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); padding: 6px 12px 4px; letter-spacing: 0.5px;">
      Đề xuất công cụ phù hợp (${scored.length})
    </div>
    ${scored.map((item, idx) => {
      const t = item.tool;
      return `
        <div class="suggestion-item ${idx === activeSuggestionIndex ? 'active' : ''}" data-tool-id="${t.id}" data-index="${idx}">
          <div class="suggestion-icon icon-halo-${t.category}">
            ${getIconSvg(t.icon)}
          </div>
          <div class="suggestion-info">
            <div class="suggestion-header">
              <span class="suggestion-title">${highlightKeywords(t.name, query)}</span>
              <span class="suggestion-badge">${t.categoryName}</span>
            </div>
            <div class="suggestion-desc">${highlightKeywords(t.desc, query)}</div>
          </div>
        </div>
      `;
    }).join('')}
    <div class="suggestion-footer">
      <span>Dùng <kbd>↑</kbd> <kbd>↓</kbd> để chọn • <kbd>Enter</kbd> để mở</span>
      <span style="color: #6366f1; font-weight: 600;">Bấm vào để dùng ngay</span>
    </div>
  `;
  dropdown.style.display = 'block';

  dropdown.querySelectorAll('.suggestion-item').forEach(el => {
    el.addEventListener('click', () => {
      const toolId = el.getAttribute('data-tool-id');
      dropdown.style.display = 'none';
      openToolModal(toolId);
    });
  });
}

function highlightKeywords(text, query) {
  if (!text || !query) return text || '';
  const words = query.trim().split(/\s+/).filter(Boolean);
  let result = text;
  for (const w of words) {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    result = result.replace(regex, '<span class="match-hl">$1</span>');
  }
  return result;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// 3. RENDER LƯỚI BENTO CÔNG CỤ (BENTO GRID DIRECTORY)
function renderSections() {
  const container = document.getElementById('sections-container');
  const query = state.searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const sectionsToRender = CATEGORIES.filter(c => c.id !== 'all');
  let totalVisibleCount = 0;

  const html = sectionsToRender.map(cat => {
    // Khi đang tìm kiếm: tự động tìm kiếm trên TOÀN BỘ 118 công cụ (không giới hạn bởi tab danh mục)
    if (!isSearching && state.currentCategory !== 'all' && state.currentCategory !== cat.id) {
      return '';
    }

    let tools = TOOLS_DATA.filter(t => t.category === cat.id);

    if (isSearching) {
      tools = tools
        .map(t => ({ tool: t, score: scoreToolMatch(t, query) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.tool);
    }

    if (tools.length === 0) return '';

    totalVisibleCount += tools.length;
    const isExpanded = state.expandedSections.has(cat.id) || isSearching;
    const initialLimit = 8;
    const displayedTools = isExpanded ? tools : tools.slice(0, initialLimit);
    const hasMore = tools.length > initialLimit && !isSearching;
    const remainingCount = tools.length - initialLimit;

    return `
      <section class="directory-section" data-section="${cat.id}">
        <div class="section-headline">
          <div class="section-title-wrap">
            <div class="section-indicator indicator-${cat.id}"></div>
            <h2 class="section-name">${tools[0].categoryName}</h2>
          </div>
          <span class="section-pill-count">${tools.length} công cụ</span>
        </div>
        
        <div class="bento-grid">
          ${displayedTools.map(tool => `
            <div class="bento-card" data-tool-id="${tool.id}">
              <div class="card-top">
                <div class="card-icon-halo icon-halo-${tool.category}">
                  ${getIconSvg(tool.icon)}
                </div>
                <div class="card-content">
                  <h3 class="card-title">${isSearching ? highlightKeywords(tool.name, query) : tool.name}</h3>
                  <p class="card-description">${isSearching ? highlightKeywords(tool.desc, query) : tool.desc}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        ${hasMore ? `
          <button class="expand-bento-btn" data-toggle-cat="${cat.id}">
            <span>${isExpanded ? 'Thu gọn danh sách' : `Khám phá thêm ${remainingCount} công cụ nữa`}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="${isExpanded ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline>
            </svg>
          </button>
        ` : ''}
      </section>
    `;
  }).join('');

  if (totalVisibleCount === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 80px 20px; color: var(--text-muted);">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; display: block; opacity: 0.6;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Không tìm thấy công cụ cho "${escapeHtml(state.searchQuery)}"</h3>
        <p style="font-size: 14px;">Thử tìm kiếm với từ khóa: <em>gộp, chia, xoay, watermark, ký tên, chuyển ảnh, chèn ảnh...</em></p>
      </div>
    `;
  } else {
    container.innerHTML = html;
  }

  // Gắn sự kiện click vào các thẻ bento
  container.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('click', () => {
      const toolId = card.dataset.toolId;
      openToolModal(toolId);
    });
  });

  // Gắn sự kiện mở rộng danh sách
  container.querySelectorAll('.expand-bento-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.toggleCat;
      if (state.expandedSections.has(catId)) {
        state.expandedSections.delete(catId);
      } else {
        state.expandedSections.add(catId);
      }
      renderSections();
    });
  });
}

// 4. MỞ MODAL WORKSPACE CHUYÊN NGHIỆP
function openToolModal(toolId) {
  const tool = TOOLS_DATA.find(t => t.id === toolId);
  if (!tool) return;

  state.activeTool = tool;
  state.uploadedFiles = [];
  const fileInput = document.getElementById('global-file-input');
  if (fileInput) fileInput.value = '';

  document.getElementById('modal-tool-name').textContent = tool.name;
  document.getElementById('modal-tool-desc').textContent = tool.desc;
  document.getElementById('modal-tool-category').textContent = tool.categoryName;
  document.getElementById('modal-tool-icon').innerHTML = getIconSvg(tool.icon);
  document.getElementById('modal-btn-text').textContent = getExecuteButtonText(tool.actionType, tool.id);

  renderModalBody(tool);

  const modal = document.getElementById('tool-modal');
  modal.style.display = 'flex';
}

function closeToolModal() {
  const modal = document.getElementById('tool-modal');
  modal.style.display = 'none';
  if (state.cameraStream) {
    try {
      state.cameraStream.getTracks().forEach(t => t.stop());
    } catch (e) {}
    state.cameraStream = null;
  }
  state.cameraCapturedPages = [];
  state.activeTool = null;
  state.uploadedFiles = [];
  state.insertImage = null;
  const fileInput = document.getElementById('global-file-input');
  if (fileInput) fileInput.value = '';
}

function getExecuteButtonText(actionType, toolId) {
  const tool = TOOLS_DATA.find(t => t.id === toolId);
  if (!tool) return 'Thực thi & Tải về';

  if (toolId === 'insert-image') return 'Chèn ảnh & Tải về (.pdf)';
  if (toolId === 'camera-to-pdf') return 'Đóng gói PDF & Tải về (.pdf)';

  if (tool.category === 'from_pdf') {
    if (toolId === 'pdf-to-word') return 'Chuyển sang Word & Tải về (.docx)';
    if (toolId === 'pdf-to-excel') return 'Chuyển sang Excel & Tải về (.xlsx)';
    if (toolId === 'pdf-to-csv') return 'Chuyển sang CSV & Tải về (.csv)';
    if (toolId === 'pdf-to-text') return 'Trích xuất Văn bản & Tải về (.txt)';
    if (toolId === 'pdf-ocr') return 'Nhận dạng chữ OCR & Tải về (.txt)';
    if (toolId === 'pdf-to-jpg') return 'Xuất ảnh JPG & Tải về (.jpg)';
    if (toolId === 'pdf-to-png' || toolId === 'extract-images') return 'Xuất ảnh PNG & Tải về (.png)';
    if (toolId === 'pdf-to-webp') return 'Xuất ảnh WebP & Tải về (.webp)';
    if (toolId === 'pdf-to-svg') return 'Xuất đồ họa SVG & Tải về (.svg)';
    if (toolId === 'pdf-to-html') return 'Chuyển sang HTML & Tải về (.html)';
    if (toolId === 'pdf-to-markdown') return 'Chuyển sang Markdown & Tải về (.md)';
    if (toolId === 'pdf-to-json') return 'Xuất dữ liệu JSON & Tải về (.json)';
    if (toolId === 'pdf-to-xml') return 'Xuất tệp XML & Tải về (.xml)';
    if (toolId === 'pdf-to-powerpoint') return 'Chuyển sang PowerPoint & Tải về (.pptx)';
    if (toolId === 'pdf-to-rtf') return 'Chuyển sang RTF & Tải về (.rtf)';
    if (toolId === 'pdf-to-epub') return 'Xuất sách EPUB & Tải về (.epub)';
    if (toolId === 'pdf-to-pdfa') return 'Chuẩn hóa PDF/A & Tải về (.pdf)';
  }

  if (tool.category === 'to_pdf') {
    return 'Chuyển sang PDF & Tải về (.pdf)';
  }

  if (tool.category === 'organize') {
    if (toolId === 'merge-pdf' || toolId === 'alternate-mix') return 'Gộp tệp & Tải về (.pdf)';
    if (toolId === 'rotate-pdf') return 'Xoay trang & Tải về (.pdf)';
    if (toolId === 'delete-pages') return 'Xóa trang & Tải về (.pdf)';
    if (toolId === 'extract-pages' || toolId === 'split-pdf') return 'Trích xuất & Tải về (.pdf)';
    return 'Sắp xếp & Tải về (.pdf)';
  }

  if (tool.category === 'edit') {
    if (toolId === 'watermark-pdf') return 'Đóng dấu mờ & Tải về (.pdf)';
    if (toolId === 'page-numbers') return 'Đánh số trang & Tải về (.pdf)';
    if (toolId === 'sign-pdf') return 'Ký tên số & Tải về (.pdf)';
    return 'Áp dụng & Tải về (.pdf)';
  }

  if (tool.category === 'optimize') {
    return 'Tối ưu hóa & Tải về (.pdf)';
  }

  if (tool.category === 'security') {
    return 'Bảo mật & Tải về (.pdf)';
  }

  return 'Thực thi & Tải về';
}

// 5. RENDER NỘI DUNG MODAL
function renderModalBody(tool) {
  const body = document.getElementById('modal-body-content');

  // Trường hợp đặc biệt: Công cụ Quét Camera trực tiếp sang PDF
  if (tool.id === 'camera-to-pdf') {
    renderCameraScannerBody(tool, body);
    return;
  }

  const isImageTool = tool.actionType === 'images_to_pdf' || (tool.category === 'to_pdf' && ['jpg-to-pdf', 'png-to-pdf', 'webp-to-pdf', 'bmp-to-pdf', 'tiff-to-pdf', 'gif-to-pdf', 'heic-to-pdf', 'photos-to-pdf'].includes(tool.id));
  
  let acceptedFiles = 'application/pdf';
  let dropzoneMainText = 'Kéo & thả tệp PDF vào đây';

  if (tool.id === 'excel-to-pdf' || tool.id === 'csv-to-pdf' || tool.id === 'ods-to-pdf') {
    acceptedFiles = '.xlsx,.xls,.csv,.ods,.tsv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv';
    dropzoneMainText = 'Kéo & thả bảng tính Excel (.xlsx, .xls) hoặc CSV vào đây';
  } else if (tool.id === 'powerpoint-to-pdf' || tool.id === 'odp-to-pdf') {
    acceptedFiles = '.pptx,.ppt,.odp,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint';
    dropzoneMainText = 'Kéo & thả bài trình chiếu PowerPoint (.pptx, .ppt) vào đây';
  } else if (tool.id === 'word-to-pdf' || tool.id === 'doc-to-pdf') {
    acceptedFiles = '.docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
    dropzoneMainText = 'Kéo & thả tài liệu Word (.docx, .doc) vào đây';
  } else if (isImageTool) {
    acceptedFiles = 'image/*,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.gif,.heic';
    dropzoneMainText = 'Kéo & thả tệp ảnh (JPG, PNG, WebP, HEIC...) vào đây';
  } else if (tool.id === 'text-to-pdf') {
    acceptedFiles = '.txt,text/plain';
    dropzoneMainText = 'Kéo & thả tệp văn bản thuần (.txt) vào đây';
  } else if (tool.id === 'html-to-pdf') {
    acceptedFiles = '.html,.htm,text/html';
    dropzoneMainText = 'Kéo & thả tệp mã HTML (.html) vào đây';
  } else if (tool.id === 'markdown-to-pdf') {
    acceptedFiles = '.md,.markdown,text/markdown';
    dropzoneMainText = 'Kéo & thả tệp Markdown (.md) vào đây';
  }

  body.innerHTML = `
    <!-- DROPZONE CHUYÊN NGHIỆP -->
    <div class="dropzone" id="modal-dropzone">
      <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="M12 12v9"></path>
        <path d="m8 16 4-4 4 4"></path>
      </svg>
      <p class="dropzone-text">${dropzoneMainText}</p>
      <p class="dropzone-sub">Hoặc bấm chọn tệp từ máy tính</p>
    </div>

    <!-- CÁC NÚT THAO TÁC FILE -->
    <div class="action-buttons-wrap">
      <button class="btn-secondary" id="btn-select-file">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        <span>Chọn tệp tin từ máy</span>
      </button>
      <button class="btn-sample" id="btn-sample-file">
        <span>✨ Dùng tài liệu mẫu (Sample File)</span>
      </button>
      ${tool.id === 'insert-image' ? `
        <button class="btn-primary" id="btn-quick-upload-img" style="background: linear-gradient(135deg, #10b981, #059669); border: none; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          <span>🖼️ Tải ảnh lên (PNG, JPG, Logo)</span>
        </button>
      ` : ''}
    </div>

    <!-- DANH SÁCH FILE ĐÃ CHỌN -->
    <div class="file-list" id="modal-file-list" style="display: none;"></div>

    <!-- BẢNG ĐIỀU KHIỂN THAM SỐ ĐỘNG -->
    <div class="tool-controls" id="modal-tool-controls">
      ${getDynamicControlsHtml(tool)}
    </div>
  `;

  // Gắn sự kiện chọn file
  const dropzone = document.getElementById('modal-dropzone');
  const selectFileBtn = document.getElementById('btn-select-file');
  const sampleFileBtn = document.getElementById('btn-sample-file');

  const openFilePicker = async () => {
    // 1. Nếu đang chạy trong Desktop Electron (Finder / File Explorer)
    if (window.electronAPI && typeof window.electronAPI.selectFiles === 'function') {
      try {
        const isMulti = ['merge-pdf', 'alternate-mix', 'images-to-pdf'].includes(tool.id) || tool.actionType === 'merge';
        const res = await window.electronAPI.selectFiles({
          title: `Chọn tệp cho [${tool.name}]`,
          properties: isMulti ? ['openFile', 'multiSelections'] : ['openFile']
        });
        if (res && !res.canceled && res.files && res.files.length > 0) {
          const filesFormatted = res.files.map(f => {
            const ab = new Uint8Array(f.buffer).buffer;
            return {
              name: f.name,
              size: f.size,
              arrayBuffer: async () => ab
            };
          });
          await handleFilesSelected(filesFormatted);
          return;
        }
        if (res && res.canceled) return;
      } catch (err) {
        console.warn('Lỗi native file dialog Electron, fallback sang input file HTML:', err);
      }
    }

    // 2. Trình duyệt Web chuẩn / HTML Input
    const fileInput = document.getElementById('global-file-input');
    if (!fileInput) return;
    fileInput.value = ''; // Luôn reset rỗng trước khi mở để chọn cùng 1 file nhiều lần không bị chặn
    fileInput.accept = acceptedFiles;
    fileInput.multiple = ['merge-pdf', 'alternate-mix', 'images-to-pdf'].includes(tool.id) || tool.actionType === 'merge';
    fileInput.onchange = (ev) => {
      handleFilesSelected(ev.target.files);
      fileInput.value = ''; // Reset rỗng ngay sau khi đọc file
    };
    fileInput.click();
  };

  selectFileBtn.addEventListener('click', openFilePicker);

  dropzone.addEventListener('click', () => {
    openFilePicker();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  });

  if (sampleFileBtn) {
    sampleFileBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await loadSampleFile();
    });
  }

  if (tool.actionType === 'sign') {
    initSignaturePad();
  }

  if (tool.id === 'insert-image' || tool.actionType === 'insert_image') {
    initInsertImageControls();
  }
}

// Giao diện Camera Scanner chuyên dụng cho "Ảnh chụp Camera sang PDF"
function renderCameraScannerBody(tool, body) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  body.innerHTML = `
    <div class="camera-scanner-wrapper" style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Khung Viewfinder Camera -->
      <div class="camera-viewfinder" style="position: relative; width: 100%; min-height: 260px; max-height: 380px; background: #090d16; border-radius: var(--radius-md); overflow: hidden; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(99, 102, 241, 0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.35);">
        <video id="camera-video" autoplay playsinline muted style="width: 100%; height: 100%; max-height: 380px; object-fit: contain; display: none;"></video>
        <canvas id="camera-capture-canvas" style="display: none;"></canvas>
        
        <div id="camera-idle-view" style="padding: 28px 16px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(99, 102, 241, 0.15); display: flex; align-items: center; justify-content: center; color: #818cf8;">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </div>
          <h3 style="color: #f8fafc; font-size: 16px; font-weight: 700; margin: 0;">Quét giấy tờ trực tiếp bằng Camera</h3>
          <p style="color: #94a3b8; font-size: 12.5px; max-width: 420px; margin: 0; line-height: 1.5;">
            Chụp trực tiếp tài liệu, hóa đơn, CMND/CCCD hoặc chứng từ bằng camera điện thoại và tự động đóng gói thành PDF chuẩn A4.
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: center; width: 100%; max-width: 320px; margin-top: 4px;">
            <button class="btn-primary" id="btn-start-camera" style="width: 100%; padding: 12px 22px; font-size: 14.5px; font-weight: 700; background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; border-radius: 30px; color: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 18px rgba(99, 102, 241, 0.45);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              <span id="btn-camera-text">Bật Camera Chụp Ngay</span>
            </button>
          </div>
        </div>

        <!-- Khung canh góc tài liệu cho WebRTC desktop -->
        <div id="camera-scanner-overlay" style="display: none; position: absolute; inset: 20px; border: 2px dashed rgba(99, 102, 241, 0.7); border-radius: 10px; pointer-events: none; box-shadow: inset 0 0 15px rgba(99,102,241,0.25);">
          <div style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.8); color: #818cf8; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; backdrop-filter: blur(4px);">📐 Đặt tài liệu thẳng hàng trong khung quét</div>
        </div>
      </div>

      <!-- Thanh công cụ khi Camera hoạt động (WebRTC desktop) -->
      <div id="camera-active-controls" style="display: none; justify-content: center; align-items: center; gap: 12px; margin-top: -4px; flex-wrap: wrap;">
        <button class="btn-primary" id="btn-snap-camera" style="padding: 10px 24px; font-size: 14px; font-weight: 700; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 30px; color: #fff; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3" fill="currentColor"></circle></svg>
          <span>📸 Chụp Trang Này (Scan)</span>
        </button>
        <button class="btn-secondary" id="btn-switch-camera" style="padding: 8px 16px; border-radius: 30px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Đổi Camera</span>
        </button>
        <button class="btn-secondary" id="btn-stop-camera" style="padding: 8px 16px; border-radius: 30px; color: #ef4444; border-color: rgba(239, 68, 68, 0.35);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
          <span>Tắt Camera</span>
        </button>
      </div>

      <!-- Nút phụ trợ: Tải ảnh từ máy / Thêm ảnh mẫu -->
      <div class="action-buttons-wrap" style="margin-top: 0; justify-content: center; gap: 10px;">
        <button class="btn-sample" id="btn-sample-camera" style="font-size: 13px;">
          <span>✨ Thêm ảnh chụp mẫu (Hóa đơn/Văn bản)</span>
        </button>
        <button class="btn-secondary" id="btn-upload-camera-img" style="font-size: 13px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Hoặc chọn ảnh từ máy</span>
        </button>
        
        <!-- Input mở camera gốc trên iPhone / Android (hoạt động 100% không cần SSL/HTTPS) -->
        <input type="file" id="native-camera-input" accept="image/*" capture="environment" style="display: none;">
        <!-- Input chọn ảnh từ thư viện -->
        <input type="file" id="camera-file-input" accept="image/*" multiple style="display: none;">
      </div>

      <!-- Danh sách các trang đã chụp -->
      <div id="camera-gallery-box" style="background: rgba(99, 102, 241, 0.04); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="font-weight: 700; font-size: 13.5px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span>Các trang đã quét:</span>
            <span id="camera-pages-count" style="background: rgba(99, 102, 241, 0.15); color: var(--brand-primary); font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 12px;">0 trang</span>
          </div>
          <button id="btn-clear-camera-pages" style="display: none; background: transparent; border: none; color: #ef4444; font-size: 12px; font-weight: 600; cursor: pointer;">Xóa hết</button>
        </div>
        <div id="camera-pages-list" style="display: flex; gap: 12px; overflow-x: auto; padding: 4px 2px 8px; min-height: 100px; align-items: center;">
          <div id="camera-empty-msg" style="color: var(--text-muted); font-size: 13px; text-align: center; width: 100%; padding: 16px 0;">
            Chưa có trang nào. Nhấn <strong>Bật Camera Chụp Ngay</strong> hoặc bấm <strong>Thêm ảnh chụp mẫu</strong> để chụp tài liệu.
          </div>
        </div>
      </div>
    </div>
  `;

  // Gắn sự kiện
  const startBtn = document.getElementById('btn-start-camera');
  const snapBtn = document.getElementById('btn-snap-camera');
  const switchBtn = document.getElementById('btn-switch-camera');
  const stopBtn = document.getElementById('btn-stop-camera');
  const sampleBtn = document.getElementById('btn-sample-camera');
  const uploadBtn = document.getElementById('btn-upload-camera-img');
  const nativeCameraInput = document.getElementById('native-camera-input');
  const fileInput = document.getElementById('camera-file-input');
  const clearBtn = document.getElementById('btn-clear-camera-pages');

  startBtn?.addEventListener('click', startCameraStream);
  snapBtn?.addEventListener('click', snapCameraFrame);
  switchBtn?.addEventListener('click', toggleCameraFacingMode);
  stopBtn?.addEventListener('click', stopCameraStream);
  sampleBtn?.addEventListener('click', addCameraSamplePhoto);

  // Xử lý khi chụp xong ảnh từ camera điện thoại (iPhone / Android)
  nativeCameraInput?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    for (const f of files) {
      const dataUrl = URL.createObjectURL(f);
      const pageNum = state.cameraCapturedPages.length + 1;
      state.cameraCapturedPages.push({
        pageNum,
        blob: f,
        dataUrl,
        name: `Trang_Chup_${pageNum}.jpg`
      });
    }
    renderCameraGallery();
    showToast(`📸 Đã chụp Trang ${state.cameraCapturedPages.length} thành công!`, 'success');
    nativeCameraInput.value = '';
  });

  uploadBtn?.addEventListener('click', () => {
    if (fileInput) fileInput.value = '';
    fileInput?.click();
  });
  fileInput?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (fileInput) fileInput.value = '';
    for (const f of files) {
      const dataUrl = URL.createObjectURL(f);
      state.cameraCapturedPages.push({
        pageNum: state.cameraCapturedPages.length + 1,
        blob: f,
        dataUrl,
        name: f.name
      });
    }
    renderCameraGallery();
    showToast(`Đã thêm ${files.length} ảnh vào danh sách quét!`, 'success');
  });

  clearBtn?.addEventListener('click', () => {
    state.cameraCapturedPages = [];
    renderCameraGallery();
    showToast('Đã xóa tất cả các trang đã chụp.', 'info');
  });

  renderCameraGallery();
}

async function startCameraStream() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isSecure = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const nativeInput = document.getElementById('native-camera-input');

  // Trên iOS Safari hoặc thiết bị di động truy cập qua HTTP LAN:
  // WebRTC navigator.mediaDevices.getUserMedia bị Safari chặn hoàn toàn vì lý do bảo mật.
  // Khi đó dùng native <input capture="environment"> để mở Camera gốc của iPhone/Android:
  if (isMobile || !isSecure || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (nativeInput) {
      nativeInput.click();
      return;
    }
  }

  // Trên máy tính / Laptop có webcam và hỗ trợ getUserMedia:
  const video = document.getElementById('camera-video');
  const idleView = document.getElementById('camera-idle-view');
  const overlay = document.getElementById('camera-scanner-overlay');
  const activeControls = document.getElementById('camera-active-controls');

  try {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(t => t.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: state.cameraFacingMode || 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    });

    state.cameraStream = stream;
    if (video) {
      video.srcObject = stream;
      video.style.display = 'block';
    }
    if (idleView) idleView.style.display = 'none';
    if (overlay) overlay.style.display = 'block';
    if (activeControls) activeControls.style.display = 'flex';
    showToast('Camera đã sẵn sàng! Đặt tài liệu trước camera và bấm "Chụp Trang".', 'info');
  } catch (err) {
    console.warn('WebRTC stream không khả dụng, mở Camera trực tiếp:', err);
    if (nativeInput) {
      nativeInput.click();
    } else {
      showToast('Không thể mở Camera: ' + (err.message || 'Chưa cấp quyền'), 'error');
    }
  }
}

function stopCameraStream() {
  if (state.cameraStream) {
    try {
      state.cameraStream.getTracks().forEach(t => t.stop());
    } catch (e) {}
    state.cameraStream = null;
  }
  const video = document.getElementById('camera-video');
  const idleView = document.getElementById('camera-idle-view');
  const overlay = document.getElementById('camera-scanner-overlay');
  const activeControls = document.getElementById('camera-active-controls');

  if (video) video.style.display = 'none';
  if (idleView) idleView.style.display = 'flex';
  if (overlay) overlay.style.display = 'none';
  if (activeControls) activeControls.style.display = 'none';
}

async function toggleCameraFacingMode() {
  state.cameraFacingMode = state.cameraFacingMode === 'user' ? 'environment' : 'user';
  await startCameraStream();
}

function snapCameraFrame() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-capture-canvas');
  if (!video || !video.videoWidth) {
    showToast('Camera chưa sẵn sàng hoặc chưa có hình ảnh!', 'error');
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const pageNum = state.cameraCapturedPages.length + 1;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    state.cameraCapturedPages.push({
      pageNum,
      blob,
      dataUrl,
      name: `Trang_Quet_${pageNum}.jpg`
    });

    renderCameraGallery();
    showToast(`Đã chụp Trang ${pageNum} thành công!`, 'success');
  }, 'image/jpeg', 0.92);
}

function addCameraSamplePhoto() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1200, 1600);

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur = 18;
  ctx.fillRect(50, 50, 1100, 1500);
  ctx.shadowBlur = 0;

  const pageNum = state.cameraCapturedPages.length + 1;
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText(`HÓA ĐƠN & TÀI LIỆU SCAN - TRANG ${pageNum}`, 100, 140);

  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('CÔNG TY TNHH GIẢI PHÁP SỐ PDFEVE PRO', 100, 185);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px sans-serif';
  ctx.fillText(`Mã chứng từ: SCAN-2026-${1000 + pageNum}  *  Ngày quét: ${new Date().toLocaleDateString('vi-VN')}`, 100, 220);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, 250);
  ctx.lineTo(1100, 250);
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('STT    MÔ TẢ HÀNG HÓA / DỊCH VỤ                SỐ LƯỢNG      ĐƠN GIÁ         THÀNH TIỀN', 100, 300);

  const sampleRows = [
    ['1', 'Bản quyền phần mềm biên tập PDFeve', '02 bộ', '1,200,000 đ', '2,400,000 đ'],
    ['2', 'Chứng thư chữ ký điện tử doanh nghiệp', '01 gói', '1,500,000 đ', '1,500,000 đ'],
    ['3', 'Bảo trì hệ thống xử lý WebAssembly offline', '12 tháng', '200,000 đ', '2,400,000 đ'],
    ['4', 'Tích hợp mô-đun bóc tách OCR tiếng Việt', '01 gói', '800,000 đ', '800,000 đ']
  ];

  ctx.font = '16px sans-serif';
  sampleRows.forEach((r, idx) => {
    const y = 350 + idx * 46;
    ctx.fillText(`${r[0]}      ${r[1].padEnd(38, ' ')} ${r[2].padEnd(12, ' ')} ${r[3].padEnd(14, ' ')} ${r[4]}`, 100, y);
  });

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 3;
  ctx.strokeRect(820, 1260, 240, 120);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ĐÃ XÁC NHẬN', 860, 1315);
  ctx.font = '13px sans-serif';
  ctx.fillText(new Date().toLocaleDateString('vi-VN'), 895, 1345);

  canvas.toBlob((blob) => {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    state.cameraCapturedPages.push({
      pageNum,
      blob,
      dataUrl,
      name: `Tai_Lieu_Mau_Trang_${pageNum}.jpg`
    });
    renderCameraGallery();
    showToast(`Đã thêm ảnh tài liệu mẫu Trang ${pageNum}!`, 'success');
  }, 'image/jpeg', 0.9);
}

function renderCameraGallery() {
  const countEl = document.getElementById('camera-pages-count');
  const listEl = document.getElementById('camera-pages-list');
  const clearBtn = document.getElementById('btn-clear-camera-pages');
  if (!listEl) return;

  const count = state.cameraCapturedPages.length;
  if (countEl) countEl.textContent = `${count} trang`;
  if (clearBtn) clearBtn.style.display = count > 0 ? 'inline-block' : 'none';

  const btnCameraText = document.getElementById('btn-camera-text');
  if (btnCameraText) {
    btnCameraText.textContent = count > 0 ? `📸 Chụp thêm trang ${count + 1}` : 'Bật Camera Chụp Ngay';
  }

  if (count === 0) {
    listEl.innerHTML = `
      <div id="camera-empty-msg" style="color: var(--text-muted); font-size: 13px; text-align: center; width: 100%; padding: 16px 0;">
        Chưa có trang nào. Nhấn <strong>Bật Camera Chụp Ngay</strong> hoặc bấm <strong>Thêm ảnh chụp mẫu</strong> để chụp tài liệu.
      </div>
    `;
    return;
  }

  listEl.innerHTML = state.cameraCapturedPages.map((p, idx) => `
    <div style="position: relative; flex-shrink: 0; width: 95px; height: 125px; border-radius: 8px; overflow: hidden; border: 2px solid rgba(99, 102, 241, 0.4); background: #000; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
      <img src="${p.dataUrl}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; bottom: 0; inset-inline: 0; background: rgba(0,0,0,0.7); color: #fff; font-size: 10.5px; font-weight: 700; text-align: center; padding: 2px 0;">
        Trang ${idx + 1}
      </div>
      <button class="btn-del-camera-page" data-page-idx="${idx}" style="position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(239,68,68,0.9); color: #fff; border: none; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Xóa trang này">✕</button>
    </div>
  `).join('');

  listEl.querySelectorAll('.btn-del-camera-page').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = Number(btn.dataset.pageIdx);
      state.cameraCapturedPages.splice(idx, 1);
      state.cameraCapturedPages.forEach((p, i) => { p.pageNum = i + 1; });
      renderCameraGallery();
    });
  });
}

// Cấu hình tham số riêng biệt cho từng công cụ
function getDynamicControlsHtml(tool) {
  if (tool.id === 'pdf-to-word') {
    return `
      <div style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; background: rgba(99, 102, 241, 0.08); padding: 16px; border-radius: var(--radius-sm); border: 1px solid rgba(99, 102, 241, 0.25);">
        <div style="font-weight: 700; color: var(--brand-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Chế độ chuyển đổi Word (.docx) Chuẩn Quốc tế
        </div>
        <p style="margin: 0; font-size: 13px;">Hệ thống sẽ bóc tách cấu trúc văn bản từ tệp PDF và tự động đóng gói thành tệp <strong>Microsoft Word (.docx)</strong> chuẩn OpenXML. Bạn có thể mở và biên tập tự do trên Microsoft Word, Apple Pages, Google Docs mà không lo lỗi định dạng.</p>
      </div>
    `;
  }

  if (tool.id === 'pdf-to-excel') {
    return `
      <div style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; background: rgba(16, 185, 129, 0.08); padding: 16px; border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.25);">
        <div style="font-weight: 700; color: #10b981; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
          Chế độ chuyển đổi bảng tính Excel
        </div>
        <p style="margin: 0; font-size: 13px;">Tự động tách các dòng văn bản và cấu trúc bảng số liệu từ PDF sang định dạng bảng tính mở ngay trên Microsoft Excel với mã hóa UTF-8 BOM chuẩn tiếng Việt.</p>
      </div>
    `;
  }

  if (tool.id === 'pdf-to-text') {
    return `
      <div style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; background: rgba(14, 165, 233, 0.08); padding: 16px; border-radius: var(--radius-sm); border: 1px solid rgba(14, 165, 233, 0.25);">
        <div style="font-weight: 700; color: #0ea5e9; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
          Chế độ trích xuất văn bản thuần túy (.txt)
        </div>
        <p style="margin: 0; font-size: 13px;">Trích xuất toàn bộ văn bản từ các trang PDF thành tệp văn bản sạch sẽ (.txt), tiện lợi cho việc sao chép hoặc xử lý tiếp.</p>
      </div>
    `;
  }

  switch (tool.actionType) {
    case 'rotate':
      return `
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Góc xoay</label>
            <select class="control-select" id="param-degrees">
              <option value="90">90° (Theo chiều kim đồng hồ)</option>
              <option value="180">180° (Lộn ngược)</option>
              <option value="270">270° (Ngược chiều kim đồng hồ)</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">Áp dụng cho trang</label>
            <select class="control-select" id="param-page-range">
              <option value="all">Tất cả các trang</option>
              <option value="odd">Chỉ các trang lẻ (1, 3, 5...)</option>
              <option value="even">Chỉ các trang chẵn (2, 4, 6...)</option>
            </select>
          </div>
        </div>
      `;

    case 'watermark':
      return `
        <div class="control-group">
          <label class="control-label">Nội dung dấu mờ (Watermark)</label>
          <input type="text" class="control-input" id="param-wm-text" value="BẢO MẬT" placeholder="Nhập chữ chìm (vd: DỰ THẢO, BẢN QUYỀN...)">
        </div>
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Độ mờ (Opacity)</label>
            <select class="control-select" id="param-wm-opacity">
              <option value="0.15">15% (Rất mờ)</option>
              <option value="0.25" selected>25% (Tiêu chuẩn)</option>
              <option value="0.45">45% (Rõ nét)</option>
              <option value="0.75">75% (Đậm)</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">Góc nghiêng</label>
            <select class="control-select" id="param-wm-angle">
              <option value="45" selected>Nghiêng 45°</option>
              <option value="0">Nằm ngang (0°)</option>
              <option value="-45">Nghiêng -45°</option>
            </select>
          </div>
        </div>
      `;

    case 'page_numbers':
      return `
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Định dạng hiển thị</label>
            <select class="control-select" id="param-pn-format">
              <option value="Trang {n} / {total}">Trang {n} / {total}</option>
              <option value="{n} / {total}">{n} / {total}</option>
              <option value="{n}">Chỉ số trang ({n})</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">Vị trí đóng số</label>
            <select class="control-select" id="param-pn-position">
              <option value="bottom-center" selected>Dưới cùng chính giữa</option>
              <option value="bottom-right">Dưới cùng góc phải</option>
              <option value="bottom-left">Dưới cùng góc trái</option>
              <option value="top-right">Trên cùng góc phải</option>
            </select>
          </div>
        </div>
      `;

    case 'delete':
      return `
        <div class="control-group">
          <label class="control-label">Các trang cần xóa (Ngăn cách bằng dấu phẩy)</label>
          <input type="text" class="control-input" id="param-delete-pages" placeholder="Ví dụ: 1, 3, 5 hoặc 2">
          <span style="font-size: 11.5px; color: var(--text-muted);">Nhập số thứ tự các trang muốn loại bỏ khỏi file.</span>
        </div>
      `;

    case 'extract':
      return `
        <div class="control-group">
          <label class="control-label">Các trang cần trích xuất sang file mới</label>
          <input type="text" class="control-input" id="param-extract-pages" value="1, 2" placeholder="Ví dụ: 1, 2 hoặc 1, 3">
        </div>
      `;

    case 'sign':
      return `
        <div class="control-group">
          <label class="control-label">Vẽ chữ ký số của bạn vào khung bên dưới</label>
          <div class="signature-canvas-wrap">
            <canvas class="signature-canvas" id="signature-canvas" width="650" height="150"></canvas>
            <div class="signature-actions">
              <button class="btn-secondary" id="btn-clear-sig" style="font-size: 12px; padding: 4px 10px;">Xóa chữ ký</button>
            </div>
          </div>
        </div>
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Ký vào trang số</label>
            <input type="number" class="control-input" id="param-sign-page" value="1" min="1">
          </div>
          <div class="control-group">
            <label class="control-label">Vị trí chữ ký</label>
            <select class="control-select" id="param-sign-pos">
              <option value="bottom-right">Góc dưới bên phải</option>
              <option value="bottom-left">Góc dưới bên trái</option>
              <option value="center">Chính giữa trang</option>
            </select>
          </div>
        </div>
      `;

    case 'encrypt':
      return `
        <div class="control-group">
          <label class="control-label">Mật khẩu bảo vệ tài liệu</label>
          <input type="password" class="control-input" id="param-password" placeholder="Nhập mật khẩu mở file...">
        </div>
      `;

    case 'compress':
      return `
        <div class="control-group">
          <label class="control-label">Mức độ nén tối ưu</label>
          <select class="control-select" id="param-compress-level">
            <option value="recommended">Nén tối ưu (Khuyên dùng - Giảm ~50% dung lượng, giữ nét chữ)</option>
            <option value="extreme">Nén cực đại (Dung lượng nhỏ nhất để gửi email)</option>
            <option value="light">Nén nhẹ (Bảo toàn chất lượng in ấn cao)</option>
          </select>
        </div>
      `;

    case 'split_even_odd':
      return `
        <div class="control-group">
          <label class="control-label">Tùy chọn tải về</label>
          <select class="control-select" id="param-even-odd-mode">
            <option value="both_zip" selected>Tách thành 2 tệp (File ZIP gồm Trang lẻ & Trang chẵn) - Khuyên dùng</option>
            <option value="both_separate">Tải riêng 2 file PDF liên tiếp (Trang lẻ và Trang chẵn)</option>
            <option value="odd">Chỉ tải tập trang lẻ (Trang 1, 3, 5, 7...)</option>
            <option value="even">Chỉ tải tập trang chẵn (Trang 2, 4, 6, 8...)</option>
          </select>
          <span style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px; display: block; line-height: 1.5;">
            📄 <strong>Trang lẻ:</strong> Các trang có số thứ tự 1, 3, 5, 7...<br>
            📄 <strong>Trang chẵn:</strong> Các trang có số thứ tự 2, 4, 6, 8...
          </span>
        </div>
      `;

    case 'insert_image':
      return `
        <!-- Khung nạp ảnh thông minh -->
        <div class="control-group" style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); border: 1.5px dashed var(--border-subtle); margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <label class="control-label" style="font-weight: 700; color: var(--text-primary); margin: 0; font-size: 13.5px;">
              🖼️ Ảnh muốn chèn vào PDF (Logo, Con dấu, Chữ ký, Ảnh minh họa):
            </label>
            <span id="insert-img-status" style="font-size: 12px; font-weight: 600; color: var(--text-muted);">Chưa có ảnh</span>
          </div>
          
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <input type="file" id="param-insert-img-file" accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml" style="display: none;">
            <button type="button" class="btn-primary" id="btn-browse-insert-img" style="font-size: 13px; padding: 8px 16px; display: inline-flex; align-items: center; gap: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span>Chọn ảnh từ máy tính (PNG, JPG, SVG)</span>
            </button>
            <button type="button" class="btn-secondary" id="btn-use-sample-img" style="font-size: 12.5px; padding: 7px 14px;">
              ✨ Dùng con dấu phê duyệt mẫu
            </button>
          </div>

          <!-- Preview hình ảnh đã chọn -->
          <div id="insert-img-preview-wrap" style="display: none; margin-top: 14px; align-items: center; gap: 14px; padding: 10px 14px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <img id="insert-img-preview" src="" alt="Preview" style="max-height: 64px; max-width: 90px; object-fit: contain; border-radius: 6px; border: 1px solid var(--border-subtle); background: #ffffff; padding: 2px;">
            <div style="flex: 1; min-width: 0;">
              <div id="insert-img-name" style="font-size: 13.5px; font-weight: 600; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">anh_chon.png</div>
              <div id="insert-img-meta" style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Đã sẵn sàng</div>
            </div>
            <button type="button" id="btn-remove-insert-img" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 6px 10px; font-size: 12px; font-weight: 600;" title="Xóa ảnh này">✕ Đổi ảnh khác</button>
          </div>
        </div>

        <!-- Tùy chỉnh vị trí & kích thước -->
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Chèn vào trang số</label>
            <select class="control-select" id="param-img-page">
              <option value="1" selected>Trang đầu tiên (Trang 1)</option>
              <option value="all">Tất cả các trang</option>
              <option value="last">Trang cuối cùng</option>
              <option value="custom">Trang cụ thể...</option>
            </select>
          </div>
          <div class="control-group" id="custom-page-wrap" style="display: none;">
            <label class="control-label">Nhập số trang</label>
            <input type="number" class="control-input" id="param-img-custom-page" value="1" min="1">
          </div>
          <div class="control-group">
            <label class="control-label">Vị trí đặt ảnh trên trang</label>
            <select class="control-select" id="param-img-position">
              <option value="bottom-right" selected>Góc dưới bên phải (Chuẩn đóng dấu / Ký)</option>
              <option value="top-right">Góc trên bên phải (Chuẩn Logo thương hiệu)</option>
              <option value="center">Chính giữa trang</option>
              <option value="top-left">Góc trên bên trái</option>
              <option value="bottom-left">Góc dưới bên trái</option>
            </select>
          </div>
        </div>

        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Kích thước ảnh</label>
            <select class="control-select" id="param-img-size">
              <option value="medium" selected>Vừa phải (Rộng ~150px - Chuẩn con dấu / logo)</option>
              <option value="small">Nhỏ gọn (Rộng ~90px - Huy hiệu / Biểu tượng)</option>
              <option value="large">Lớn (Rộng ~260px - Ảnh minh họa tài liệu)</option>
              <option value="full">Khổ lớn (Rộng ~420px)</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">Độ trong suốt (Opacity)</label>
            <select class="control-select" id="param-img-opacity">
              <option value="1" selected>100% (Đậm nét nguyên bản)</option>
              <option value="0.85">85% (Hơi trong suốt)</option>
              <option value="0.5">50% (Mờ dạng dấu chìm Watermark)</option>
              <option value="0.25">25% (Rất mờ làm nền văn bản)</option>
            </select>
          </div>
        </div>
      `;

    case 'crop':
      return `
        <div class="control-group">
          <label class="control-label">Độ rộng lề cần cắt bỏ (Margin Trimming)</label>
          <select class="control-select" id="param-crop-margin">
            <option value="18">Cắt lề mỏng (18 pt ~ 6.3 mm - Xóa viền đen khi scan)</option>
            <option value="36" selected>Cắt lề chuẩn (36 pt ~ 12.7 mm - Nửa inch, Khuyên dùng)</option>
            <option value="54">Cắt lề rộng (54 pt ~ 19.0 mm - Cắt bớt khoảng trắng lớn)</option>
            <option value="72">Cắt sâu (72 pt ~ 25.4 mm - Thu gọn 1 inch mỗi chiều)</option>
          </select>
          <span style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px; display: block;">
            ✂️ Giúp loại bỏ khoảng lề trắng dư thừa, giúp trang tài liệu hiển thị trọn vẹn và vừa vặn màn hình điện thoại hoặc máy tính bảng.
          </span>
        </div>
      `;

    case 'editor':
      return `
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Văn bản / Từ khóa cần tìm</label>
            <input type="text" class="control-input" id="param-find-text" value="PDFeve" placeholder="Nhập từ cần sửa...">
          </div>
          <div class="control-group">
            <label class="control-label">Thay thế thành nội dung mới</label>
            <input type="text" class="control-input" id="param-replace-text" value="PDFeve Studio" placeholder="Nhập nội dung mới...">
          </div>
        </div>
      `;

    case 'shapes':
      return `
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Loại hình khối cần chèn</label>
            <select class="control-select" id="param-shape-type">
              <option value="rect" selected>Khung chữ nhật bo góc (Hộp thông tin)</option>
              <option value="arrow">Mũi tên chỉ dẫn (Arrow Callout)</option>
              <option value="circle">Hình tròn đóng dấu (Circle Stamp)</option>
              <option value="line">Đường kẻ phân cách (Divider Line)</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">Vị trí chèn</label>
            <select class="control-select" id="param-shape-pos">
              <option value="middle" selected>Chính giữa trang</option>
              <option value="top">Phía trên cùng</option>
              <option value="bottom">Phía dưới cùng</option>
            </select>
          </div>
        </div>
      `;

    case 'links':
      return `
        <div class="control-group">
          <label class="control-label">Địa chỉ liên kết Website (URL Hyperlink)</label>
          <input type="url" class="control-input" id="param-web-url" value="https://pdfeve.vn/portal" placeholder="https://example.com/...">
          <span style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px; display: block;">
            🔗 Người xem khi mở file PDF có thể bấm trực tiếp vào liên kết để mở trang web ngoài.
          </span>
        </div>
      `;

    case 'compare':
      return `
        <div class="control-group" style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle);">
          <label class="control-label" style="font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
            🔍 Tệp PDF thứ hai để đối chiếu:
          </label>
          <p style="margin: 0 0 10px 0; font-size: 12.5px; color: var(--text-secondary);">
            Hệ thống sẽ đặt 2 phiên bản tài liệu cạnh nhau, tự động phân tích độ chênh lệch số trang, dung lượng và đối chiếu nội dung.
          </p>
          <button type="button" class="btn-secondary" id="btn-load-compare-sample" style="font-size: 12.5px; padding: 6px 14px;">
            ✨ Tự nạp bản đối chiếu mẫu (Sample Version B)
          </button>
        </div>
      `;

    case 'insert_pdf':
      return `
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Chèn tài liệu vào sau trang số</label>
            <input type="number" class="control-input" id="param-insert-index" value="1" min="1">
          </div>
          <div class="control-group">
            <label class="control-label">Chế độ chèn</label>
            <select class="control-select">
              <option selected>Chèn toàn bộ tài liệu phụ lục</option>
              <option>Chỉ chèn trang đầu tiên</option>
            </select>
          </div>
        </div>
      `;

    case 'replace_pages':
      return `
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Số thứ tự trang cần thay thế</label>
            <input type="number" class="control-input" id="param-target-page" value="1" min="1">
          </div>
          <div class="control-group">
            <label class="control-label">Nguồn trang thay thế</label>
            <select class="control-select">
              <option selected>Trang tài liệu mới tải lên</option>
              <option>Trang mẫu cập nhật từ hệ thống</option>
            </select>
          </div>
        </div>
      `;

    case 'booklet':
      return `
        <div class="control-group">
          <label class="control-label">Quy cách in sách gập (Booklet Imposition)</label>
          <select class="control-select">
            <option selected>Khổ A4 gấp đôi (Tạo thành sách bỏ túi khổ A5 - Bấm kim giữa)</option>
            <option>Khổ A3 gấp đôi (Tạo thành sách khổ chuẩn A4)</option>
          </select>
          <span style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px; display: block;">
            📖 Trang sẽ được sắp xếp theo trật tự yên ngựa (saddle-stitch), có đường gấp nét đứt ở giữa tờ in.
          </span>
        </div>
      `;

    case 'measure':
      return `
        <div class="control-row">
          <div class="control-group">
            <label class="control-label">Tỷ lệ bản vẽ kỹ thuật kiến trúc</label>
            <select class="control-select">
              <option value="1:100" selected>Tỷ lệ 1:100 (1cm trên bản vẽ = 1m thực tế)</option>
              <option value="1:50">Tỷ lệ 1:50 (Chi tiết kiến trúc)</option>
              <option value="1:200">Tỷ lệ 1:200 (Mặt bằng quy hoạch)</option>
              <option value="1:500">Tỷ lệ 1:500 (Bản đồ phân lô)</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">Đơn vị đo</label>
            <select class="control-select">
              <option selected>Mét (m)</option>
              <option>Milimet (mm)</option>
            </select>
          </div>
        </div>
      `;

    case 'create_form':
      return `
        <div class="control-group">
          <label class="control-label">Kiểu form biểu mẫu tương tác (Interactive AcroForm)</label>
          <select class="control-select">
            <option selected>Form thu thập thông tin cá nhân (Họ tên, Email, Checkbox đồng ý)</option>
            <option>Đơn đăng ký dịch vụ & Cam kết</option>
            <option>Bảng khảo sát ý kiến khách hàng</option>
          </select>
          <span style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px; display: block;">
            ✍️ Tạo các trường dữ liệu tương tác thực thụ, cho phép người dùng click chuột và gõ chữ trực tiếp trên Adobe Acrobat hoặc trình duyệt.
          </span>
        </div>
      `;

    case 'clean_scan':
      return `
        <div class="control-group">
          <label class="control-label">Mức độ tẩy vết nhiễu mép trang scan</label>
          <select class="control-select">
            <option selected>Tẩy sạch viền đen và tăng độ nét chữ (Khuyên dùng)</option>
            <option>Tăng tối đa độ tương phản (Chữ đen tuyền, nền trắng tinh)</option>
          </select>
        </div>
      `;

    case 'remove_blanks':
      return `
        <div class="control-group">
          <label class="control-label">Cơ chế phát hiện trang trắng</label>
          <select class="control-select">
            <option selected>Tự động nhận diện và xóa các trang trắng không có dữ liệu</option>
            <option>Xóa trang trắng ở cuối tài liệu</option>
          </select>
        </div>
      `;

    case 'permissions':
      return `
        <div class="control-group">
          <label class="control-label">Chế độ phân quyền tài liệu</label>
          <select class="control-select">
            <option selected>Chỉ đọc (Chặn in ấn và Chặn sao chép nội dung)</option>
            <option>Cho phép in ấn ở độ phân giải thấp</option>
          </select>
        </div>
      `;

    default:
      return `
        <div style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; background: var(--bg-surface); padding: 14px; border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle);">
          💡 <strong>Quy trình xử lý an toàn:</strong> Sau khi nạp tệp tài liệu, nhấn nút <strong>Thực thi & Tải về</strong>. Tệp của bạn được xử lý trực tiếp 100% trên RAM của trình duyệt thông qua WebAssembly, bảo mật hoàn toàn.
        </div>
      `;
  }
}

// 6. TẢI FILE MẪU CHUYÊN BIỆT ĐỂ TEST TỨC THÌ
async function loadSampleFile() {
  try {
    showToast('Đang khởi tạo tài liệu mẫu cho công cụ...', 'info');
    const fileIndex = state.uploadedFiles.length + 1;
    const sampleObj = await toolExecutor.createSampleForTool(state.activeTool, fileIndex);
    
    if (state.activeTool?.id === 'merge-pdf' || state.activeTool?.id === 'alternate-mix') {
      state.uploadedFiles.push(sampleObj);
      if (state.uploadedFiles.length === 1) {
        // Tự động tạo luôn tệp thứ 2 để người dùng có thể bấm Gộp ngay lập tức
        const sampleObj2 = await toolExecutor.createSampleForTool(state.activeTool, 2);
        state.uploadedFiles.push(sampleObj2);
      }
    } else {
      state.uploadedFiles = [sampleObj];
    }

    updateFileListUI();
    showToast(`Đã nạp ${sampleObj.name} thành công!`, 'success');
  } catch (err) {
    showToast(err.message || 'Lỗi khi tạo file mẫu', 'error');
  }
}

// Xử lý khi người dùng chọn/kéo thả file
async function handleFilesSelected(files) {
  if (!files || files.length === 0) return;

  const isMulti = ['merge-pdf', 'alternate-mix', 'images-to-pdf'].includes(state.activeTool?.id) || state.activeTool?.actionType === 'merge';

  const newFiles = Array.from(files);
  if (!isMulti) {
    // Với công cụ xử lý 1 file: Tệp mới luôn tự động thay thế tệp cũ trong hàng đợi
    state.uploadedFiles = [];
  }

  for (const f of newFiles) {
    const buffer = typeof f.arrayBuffer === 'function' ? await f.arrayBuffer() : f.buffer;
    state.uploadedFiles.push({
      file: f,
      name: f.name,
      size: formatFileSize(f.size),
      buffer
    });
    if (!isMulti) break;
  }

  // Luôn reset giá trị của file input để cho phép người dùng chọn lại cùng 1 file bao nhiêu lần tùy ý
  const fileInput = document.getElementById('global-file-input');
  if (fileInput) fileInput.value = '';

  updateFileListUI();
  showToast(`Đã nạp ${state.uploadedFiles.length} tệp tin vào không gian xử lý.`, 'success');
}

function updateFileListUI() {
  const container = document.getElementById('modal-file-list');
  if (state.uploadedFiles.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = state.uploadedFiles.map((item, index) => `
    <div class="file-item">
      <div class="file-item-info">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        <div>
          <div class="file-item-name">${item.name}</div>
          <div class="file-item-size">${item.size}</div>
        </div>
      </div>
      <button class="file-remove-btn" data-remove-idx="${index}" title="Xóa tệp này">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  `).join('');

  container.querySelectorAll('.file-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = Number(btn.dataset.removeIdx);
      state.uploadedFiles.splice(idx, 1);
      const fileInput = document.getElementById('global-file-input');
      if (fileInput) fileInput.value = '';
      updateFileListUI();
    });
  });
}

// 7. KHỞI TẠO BẢNG VẼ CHỮ KÝ
function initSignaturePad() {
  const canvas = document.getElementById('signature-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let drawing = false;

  const startDraw = (e) => {
    drawing = true;
    state.signaturePad.hasContent = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    drawing = false;
  };

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
  canvas.addEventListener('touchend', stopDraw);

  const clearBtn = document.getElementById('btn-clear-sig');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      state.signaturePad.hasContent = false;
    });
  }
}

// KHỞI TẠO ĐIỀU KHIỂN CHÈN ẢNH VÀO PDF
function initInsertImageControls() {
  const fileInput = document.getElementById('param-insert-img-file');
  const browseBtn = document.getElementById('btn-browse-insert-img');
  const quickBtn = document.getElementById('btn-quick-upload-img');
  const sampleBtn = document.getElementById('btn-use-sample-img');
  const removeBtn = document.getElementById('btn-remove-insert-img');
  const pageSelect = document.getElementById('param-img-page');
  const customPageWrap = document.getElementById('custom-page-wrap');

  if (pageSelect && customPageWrap) {
    pageSelect.addEventListener('change', () => {
      customPageWrap.style.display = pageSelect.value === 'custom' ? 'block' : 'none';
    });
  }

  const triggerSelect = () => {
    if (fileInput) fileInput.value = '';
    fileInput?.click();
  };
  browseBtn?.addEventListener('click', triggerSelect);
  quickBtn?.addEventListener('click', triggerSelect);

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (fileInput) fileInput.value = '';
    if (!file) return;
    try {
      showToast('Đang tải và tối ưu hóa hình ảnh...', 'info');
      const pngBytes = await imageFileToPngBytes(file);
      const dataUrl = URL.createObjectURL(file);
      state.insertImage = {
        bytes: pngBytes,
        dataUrl,
        name: file.name,
        size: formatFileSize(file.size)
      };
      updateInsertImagePreview();
      showToast(`Đã chọn hình ảnh "${file.name}"!`, 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Lỗi khi đọc file ảnh', 'error');
    }
  });

  sampleBtn?.addEventListener('click', () => {
    const sampleSeal = createSampleSealPng();
    state.insertImage = sampleSeal;
    updateInsertImagePreview();
    showToast('Đã chọn con dấu phê duyệt mẫu!', 'success');
  });

  removeBtn?.addEventListener('click', () => {
    state.insertImage = null;
    updateInsertImagePreview();
  });

  if (state.insertImage) {
    updateInsertImagePreview();
  }
}

function updateInsertImagePreview() {
  const previewWrap = document.getElementById('insert-img-preview-wrap');
  const previewImg = document.getElementById('insert-img-preview');
  const nameEl = document.getElementById('insert-img-name');
  const metaEl = document.getElementById('insert-img-meta');
  const statusEl = document.getElementById('insert-img-status');

  if (!previewWrap) return;

  if (state.insertImage) {
    previewWrap.style.display = 'flex';
    if (previewImg) previewImg.src = state.insertImage.dataUrl;
    if (nameEl) nameEl.textContent = state.insertImage.name || 'Ảnh đã chọn';
    if (metaEl) metaEl.textContent = state.insertImage.size || `${state.insertImage.width} × ${state.insertImage.height} px`;
    if (statusEl) {
      statusEl.textContent = '✅ Đã sẵn sàng chèn';
      statusEl.style.color = '#10b981';
    }
  } else {
    previewWrap.style.display = 'none';
    if (statusEl) {
      statusEl.textContent = 'Chưa có ảnh';
      statusEl.style.color = 'var(--text-muted)';
    }
  }
}

async function imageFileToPngBytes(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      if (canvas.toBlob) {
        canvas.toBlob(blob => {
          if (blob) {
            blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf)));
          } else {
            const dataUrl = canvas.toDataURL('image/png');
            const bin = atob(dataUrl.split(',')[1]);
            const u8 = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
            resolve(u8);
          }
        }, 'image/png');
      } else {
        const dataUrl = canvas.toDataURL('image/png');
        const bin = atob(dataUrl.split(',')[1]);
        const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        resolve(u8);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không thể đọc tệp ảnh. Vui lòng chọn ảnh hợp lệ (PNG, JPG, SVG, WebP)!'));
    };
    img.src = url;
  });
}

function createSampleSealPng() {
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 240;
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(120, 120, 110, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(120, 120, 102, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 120, 92);

  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('ĐÃ DUYỆT', 120, 125);

  const today = new Date().toLocaleDateString('vi-VN');
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(today, 120, 150);

  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('CÔNG TY PDFEVE STUDIO', 120, 48);
  ctx.fillText('CHỨNG THỰC BẢN QUYỀN', 120, 192);

  const dataUrl = canvas.toDataURL('image/png');
  const bin = atob(dataUrl.split(',')[1]);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);

  return {
    bytes: u8,
    dataUrl,
    name: 'Con_Dau_Phe_Duyet_Mau.png',
    width: 240,
    height: 240,
    size: '12 KB'
  };
}

// 8. THỰC THI NGHIỆP VỤ CÔNG CỤ (EXECUTE WORKSPACE CHO TOÀN BỘ 118 CÔNG CỤ)
async function executeActiveTool() {
  const tool = state.activeTool;
  if (!tool) return;

  const executeBtn = document.getElementById('modal-execute-btn');
  const originalHtml = executeBtn.innerHTML;

  try {
    // Xử lý riêng biệt cho công cụ Chụp Camera sang PDF
    if (tool.id === 'camera-to-pdf') {
      if (!state.cameraCapturedPages || state.cameraCapturedPages.length === 0) {
        showToast('Vui lòng chụp ít nhất 1 trang bằng Camera hoặc bấm "Thêm ảnh chụp mẫu" trước!', 'error');
        return;
      }

      executeBtn.disabled = true;
      executeBtn.innerHTML = '<span>Đang đóng gói PDF từ Camera...</span>';

      const imageBlobs = state.cameraCapturedPages.map(p => p.blob);
      const pdfBytes = await pdfEngine.imagesToPDF(imageBlobs);
      await pdfEngine.downloadFile(pdfBytes, 'Tai_Lieu_Camera_PDFeve.pdf');
      showToast(`Đã đóng gói ${imageBlobs.length} trang chụp camera thành PDF thành công!`, 'success');

      stopCameraStream();
      closeToolModal();
      return;
    }

    if (state.uploadedFiles.length === 0) {
      showToast('Vui lòng chọn file hoặc bấm "Dùng tài liệu mẫu" trước!', 'error');
      return;
    }

    if (tool.id === 'insert-image' && !state.insertImage) {
      showToast('Vui lòng tải ảnh lên hoặc bấm "Dùng con dấu mẫu" trước khi thực thi!', 'error');
      return;
    }

    executeBtn.disabled = true;
    executeBtn.innerHTML = '<span>Đang xử lý tài liệu...</span>';

    const firstBuffer = state.uploadedFiles[0]?.buffer;
    const params = {
      degrees: document.getElementById('param-degrees')?.value,
      pageRange: document.getElementById('param-page-range')?.value,
      watermarkText: document.getElementById('param-wm-text')?.value,
      watermarkOpacity: document.getElementById('param-wm-opacity')?.value,
      watermarkAngle: document.getElementById('param-wm-angle')?.value,
      pageNumberFormat: document.getElementById('param-pn-format')?.value,
      pageNumberPosition: document.getElementById('param-pn-position')?.value,
      deletePages: document.getElementById('param-delete-pages')?.value,
      extractPages: document.getElementById('param-extract-pages')?.value,
      signPage: document.getElementById('param-sign-page')?.value,
      signPos: document.getElementById('param-sign-pos')?.value,
      compressLevel: document.getElementById('param-compress-level')?.value,
      evenOddMode: document.getElementById('param-even-odd-mode')?.value,
      insertImageBytes: state.insertImage?.bytes,
      imgPage: document.getElementById('param-img-page')?.value,
      imgCustomPage: document.getElementById('param-img-custom-page')?.value,
      imgPosition: document.getElementById('param-img-position')?.value,
      imgSize: document.getElementById('param-img-size')?.value,
      imgOpacity: document.getElementById('param-img-opacity')?.value,
      cropMargin: document.getElementById('param-crop-margin')?.value,
      findText: document.getElementById('param-find-text')?.value,
      replaceText: document.getElementById('param-replace-text')?.value,
      shapeType: document.getElementById('param-shape-type')?.value,
      shapePos: document.getElementById('param-shape-pos')?.value,
      webUrl: document.getElementById('param-web-url')?.value,
      insertIndex: document.getElementById('param-insert-index')?.value,
      targetPage: document.getElementById('param-target-page')?.value,
      password: document.getElementById('param-password')?.value
    };

    // Nếu là công cụ ký tay và người dùng có vẽ trên canvas
    if (tool.id === 'sign-pdf' && state.signaturePad?.hasContent) {
      const canvas = document.getElementById('signature-canvas');
      if (canvas) {
        const sigDataUrl = canvas.toDataURL('image/png');
        const pageNumber = Number(params.signPage || 1);
        let x = 380, y = 70;
        if (params.signPos === 'bottom-left') { x = 60; y = 70; }
        else if (params.signPos === 'center') { x = 210; y = 380; }
        const resultBytes = await pdfEngine.signPDF(firstBuffer, sigDataUrl, { pageNumber, x, y });
        pdfEngine.downloadFile(resultBytes, 'Da_Ky_Ten_PDFeve.pdf');
        showToast(`Đã gắn chữ ký số vào trang ${pageNumber} thành công!`, 'success');
        closeToolModal();
        return;
      }
    }

    // Thực thi xử lý chuyên biệt cho toàn bộ 118 công cụ qua toolExecutor
    const result = await toolExecutor.executeTool(tool, firstBuffer, state.uploadedFiles, params);

    if (result && result.blob) {
      pdfEngine.downloadFile(result.blob, result.filename, result.mimeType);
      showToast(result.message || `Đã hoàn tất nghiệp vụ [${tool.name}] thành công!`, 'success');
    }

    closeToolModal();
  } catch (err) {
    console.error('Lỗi khi xử lý công cụ:', err);
    showToast(err.message || 'Lỗi trong quá trình xử lý tệp.', 'error');
  } finally {
    executeBtn.disabled = false;
    executeBtn.innerHTML = originalHtml;
  }
}

// 9. GẮN SỰ KIỆN HỆ THỐNG
function setupEventListeners() {
  // Tìm kiếm tức thì với gợi ý đề xuất trực quan
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderSections();
      updateSearchSuggestions(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
      if (state.searchQuery.trim()) {
        updateSearchSuggestions(state.searchQuery);
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      const dropdown = document.getElementById('search-suggestions-dropdown');
      if (!dropdown || dropdown.style.display === 'none') return;
      const items = dropdown.querySelectorAll('.suggestion-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
        items.forEach((it, idx) => it.classList.toggle('active', idx === activeSuggestionIndex));
        items[activeSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
        items.forEach((it, idx) => it.classList.toggle('active', idx === activeSuggestionIndex));
        items[activeSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
          e.preventDefault();
          const toolId = items[activeSuggestionIndex].getAttribute('data-tool-id');
          dropdown.style.display = 'none';
          openToolModal(toolId);
        }
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
      }
    });
  }

  // Đóng dropdown gợi ý khi bấm ra ngoài
  document.addEventListener('click', (e) => {
    const searchWrap = document.getElementById('nav-search-wrap');
    if (searchWrap && !searchWrap.contains(e.target)) {
      const dropdown = document.getElementById('search-suggestions-dropdown');
      if (dropdown) dropdown.style.display = 'none';
    }
  });

  // Chuyển đổi theme Sáng / Tối
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

  // Nút Nạp tệp nhanh trên Navbar
  document.getElementById('nav-quick-upload').addEventListener('click', () => {
    openToolModal('merge-pdf');
  });

  // Nút đóng modal
  document.getElementById('modal-close-btn').addEventListener('click', closeToolModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeToolModal);
  document.getElementById('modal-execute-btn').addEventListener('click', executeActiveTool);

  // Đóng modal khi bấm ra ngoài overlay
  document.getElementById('tool-modal').addEventListener('click', (e) => {
    if (e.target.id === 'tool-modal') closeToolModal();
  });

  // Modal mở trên Điện thoại qua QR Code
  const openMobileBtn = document.getElementById('btn-open-mobile-modal');
  const mobileModal = document.getElementById('mobile-qr-modal');
  const closeMobileBtn = document.getElementById('btn-close-mobile-modal');
  const copyMobileBtn = document.getElementById('btn-copy-mobile-url');
  const qrImg = document.getElementById('mobile-qr-img');
  const lanUrlEl = document.getElementById('mobile-lan-url');

  if (openMobileBtn && mobileModal) {
    openMobileBtn.addEventListener('click', async () => {
      let host = '192.168.1.210';
      let port = window.location.port || '4567';
      try {
        if (window.electronAPI && typeof window.electronAPI.getLanInfo === 'function') {
          const info = await window.electronAPI.getLanInfo();
          if (info && info.ip) host = info.ip;
          if (info && info.port) port = String(info.port);
        } else {
          const res = await fetch('/api/lan-ip');
          if (res.ok) {
            const data = await res.json();
            if (data && data.ip) host = data.ip;
            if (data && data.port) port = String(data.port);
          }
        }
      } catch (e) {}

      if (window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        host = window.location.hostname;
      }

      const targetUrl = `http://${host}:${port}`;
      if (lanUrlEl) lanUrlEl.textContent = targetUrl;
      if (qrImg) {
        if (typeof window.createQrDataUrl === 'function') {
          qrImg.src = window.createQrDataUrl(targetUrl, 5, 4);
        } else {
          qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(targetUrl)}`;
        }
      }
      mobileModal.style.display = 'flex';
    });

    closeMobileBtn?.addEventListener('click', () => {
      mobileModal.style.display = 'none';
    });

    mobileModal.addEventListener('click', (e) => {
      if (e.target === mobileModal) mobileModal.style.display = 'none';
    });

    copyMobileBtn?.addEventListener('click', () => {
      const urlText = lanUrlEl?.textContent || 'http://192.168.1.210:4567';
      navigator.clipboard.writeText(urlText).then(() => {
        showToast('Đã sao chép liên kết mở trên điện thoại!', 'success');
      }).catch(() => {
        showToast(urlText, 'info');
      });
    });
  }
}

function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const input = document.getElementById('search-input');
      input?.focus();
      input?.select();
    }
    if (e.key === 'Escape') {
      const dropdown = document.getElementById('search-suggestions-dropdown');
      if (dropdown) dropdown.style.display = 'none';
      closeToolModal();
    }
  });
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('app-toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 3200);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ==========================================
// HỖ TRỢ LƯU FILE TRÊN MOBILE & IN-APP WEBVIEW (ZALO, FACEBOOK, SAFARI)
// ==========================================
function checkInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isInApp = /FBAN|FBAV|Instagram|Line|Zalo|MicroMessenger|musical_ly|BytedanceWebview/i.test(ua) || (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua));
  const banner = document.getElementById('in-app-browser-banner');
  const closeBtn = document.getElementById('btn-close-inapp-banner');

  if (isInApp && banner) {
    banner.style.display = 'block';
    closeBtn?.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }
}

// Hàm hiển thị Modal tải về thành công (Dùng cho cả Mobile, Safari, Zalo)
window.showDownloadSuccessModal = function(blob, filename, mimeType, downloadUrl, viewUrl) {
  const modal = document.getElementById('download-result-modal');
  if (!modal) return;

  const nameEl = document.getElementById('download-result-filename');
  const metaEl = document.getElementById('download-result-meta');
  const downloadLink = document.getElementById('btn-modal-download-file');
  const viewLink = document.getElementById('btn-modal-view-pdf');
  const shareBtn = document.getElementById('btn-modal-share-file');
  const closeBtn = document.getElementById('btn-close-download-result');

  if (nameEl) nameEl.textContent = filename;
  if (metaEl) metaEl.textContent = `Kích thước: ${formatFileSize(blob.size || 0)}  *  Định dạng: ${mimeType || 'application/pdf'}`;

  // 1. Nút Tải về máy trực tiếp (href đến attachment URL của server)
  if (downloadLink) {
    downloadLink.href = downloadUrl;
    downloadLink.setAttribute('download', filename);
    downloadLink.onclick = () => {
      showToast('Đang tải tệp về thư mục Tệp (Files)...', 'info');
    };
  }

  // 2. Nút Xem trực tiếp trên Safari
  if (viewLink) {
    viewLink.href = viewUrl || downloadUrl;
    viewLink.target = '_blank';
  }

  // 3. Nút Lưu vào Tệp / Chia sẻ (Native Web Share Sheet)
  if (shareBtn) {
    shareBtn.onclick = async () => {
      if (navigator.canShare) {
        try {
          const file = new File([blob], filename, { type: mimeType });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: filename,
              text: 'Tài liệu xuất bản từ PDFeve'
            });
            return;
          }
        } catch (e) {
          if (e.name === 'AbortError') return;
        }
      }

      // Fallback: điều hướng đến link tải attachment
      window.location.href = downloadUrl;
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = 'none'; };
  }
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  modal.style.display = 'flex';
};

// ==========================================
// HỆ THỐNG TỰ ĐỘNG CẬP NHẬT PHIÊN BẢN (AUTO-UPDATE QUA GITHUB)
// ==========================================
function setupAutoUpdater() {
  const btnCheckUpdate = document.getElementById('btn-check-update');
  const updateModal = document.getElementById('update-modal');
  const btnCloseModal = document.getElementById('btn-close-update-modal');
  const btnCancel = document.getElementById('btn-cancel-update');
  const btnAction = document.getElementById('btn-action-update');
  const subtitle = document.getElementById('update-modal-subtitle');
  const currentVer = document.getElementById('update-current-ver');
  const targetVer = document.getElementById('update-target-ver');
  const changelogWrap = document.getElementById('update-changelog-wrap');
  const changelogContent = document.getElementById('update-changelog-content');
  const progressWrap = document.getElementById('update-progress-wrap');
  const progressBar = document.getElementById('update-progress-bar');
  const progressPercent = document.getElementById('update-progress-percent');
  const progressLabel = document.getElementById('update-progress-label');

  if (!btnCheckUpdate) return;

  const closeModal = () => {
    if (updateModal) updateModal.style.display = 'none';
  };
  btnCloseModal?.addEventListener('click', closeModal);
  btnCancel?.addEventListener('click', closeModal);
  updateModal?.addEventListener('click', (e) => {
    if (e.target === updateModal) closeModal();
  });

  // Bấm nút Cập nhật trên Navbar
  btnCheckUpdate.addEventListener('click', async () => {
    if (!window.electronAPI || typeof window.electronAPI.checkForUpdates !== 'function') {
      showToast('🌐 Bạn đang sử dụng bản Web Online, hệ thống luôn tự động đồng bộ mã nguồn mới nhất!', 'info');
      return;
    }

    if (updateModal) {
      updateModal.style.display = 'flex';
      if (subtitle) subtitle.textContent = 'Đang kiểm tra kết nối máy chủ GitHub Releases...';
      if (progressWrap) progressWrap.style.display = 'none';
      if (changelogWrap) changelogWrap.style.display = 'none';
      if (btnAction) {
        btnAction.disabled = true;
        btnAction.innerHTML = '<span>⏳ Đang kiểm tra...</span>';
      }
    }

    try {
      await window.electronAPI.checkForUpdates();
    } catch (err) {
      console.warn('Lỗi khi kiểm tra cập nhật:', err);
    }
  });

  // Lắng nghe sự kiện từ Electron Main Process
  if (window.electronAPI && typeof window.electronAPI.onUpdaterEvent === 'function') {
    window.electronAPI.onUpdaterEvent((data) => {
      if (!data) return;

      switch (data.status) {
        case 'checking':
          if (subtitle) subtitle.textContent = data.message || 'Đang kiểm tra kết nối máy chủ GitHub...';
          break;

        case 'available':
          if (updateModal) updateModal.style.display = 'flex';
          if (subtitle) subtitle.textContent = '🎉 Đã có phiên bản mới! Hãy nâng cấp để trải nghiệm các tính năng mới nhất.';
          if (currentVer) currentVer.textContent = 'v' + (data.currentVersion || '1.0.0');
          if (targetVer) targetVer.textContent = 'v' + (data.targetVersion || '1.0.1');

          if (data.releaseNotes && changelogContent && changelogWrap) {
            changelogContent.innerHTML = data.releaseNotes;
            changelogWrap.style.display = 'block';
          }
          if (progressWrap) progressWrap.style.display = 'none';

          if (btnAction) {
            btnAction.disabled = false;
            btnAction.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btnAction.innerHTML = '<span>🚀 Tải bản cập nhật</span>';
            btnAction.onclick = () => {
              window.electronAPI.downloadUpdate();
              btnAction.disabled = true;
              btnAction.innerHTML = '<span>⏳ Đang bắt đầu tải...</span>';
            };
          }
          showToast(`Đã có bản cập nhật mới v${data.targetVersion}!`, 'success');
          break;

        case 'downloading':
          if (updateModal) updateModal.style.display = 'flex';
          if (progressWrap) progressWrap.style.display = 'block';
          const pct = data.percent || 0;
          if (progressBar) progressBar.style.width = pct + '%';
          if (progressPercent) progressPercent.textContent = pct + '%';
          if (progressLabel) progressLabel.textContent = `Đang tải bản cập nhật ngầm: ${pct}%`;
          if (subtitle) subtitle.textContent = 'Đang tải gói cài đặt ngầm từ máy chủ, bạn vẫn có thể làm việc bình thường...';

          if (btnAction) {
            btnAction.disabled = true;
            btnAction.innerHTML = `<span>⏳ Đang tải (${pct}%)</span>`;
          }
          break;

        case 'downloaded':
          if (updateModal) updateModal.style.display = 'flex';
          if (progressWrap) progressWrap.style.display = 'block';
          if (progressBar) progressBar.style.width = '100%';
          if (progressPercent) progressPercent.textContent = '100%';
          if (progressLabel) progressLabel.textContent = 'Đã tải hoàn tất 100%! Sẵn sàng cài đặt.';
          if (subtitle) subtitle.textContent = 'Tệp cài đặt đã sẵn sàng. Bấm nút bên dưới để khởi động lại và cập nhật ngay!';

          if (btnAction) {
            btnAction.disabled = false;
            btnAction.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
            btnAction.innerHTML = '<span>🔄 Khởi động lại & Nâng cấp ngay</span>';
            btnAction.onclick = () => {
              window.electronAPI.installUpdate();
            };
          }
          showToast('✅ Đã tải xong bản cập nhật! Khởi động lại ứng dụng để hoàn tất.', 'success');
          break;

        case 'not-available':
          if (subtitle) subtitle.textContent = `Bạn đang sử dụng phiên bản mới nhất (${data.currentVersion ? 'v' + data.currentVersion : 'v1.0.0'})!`;
          if (currentVer) currentVer.textContent = 'v' + (data.currentVersion || '1.0.0');
          if (targetVer) targetVer.textContent = 'v' + (data.currentVersion || '1.0.0');
          if (progressWrap) progressWrap.style.display = 'none';

          if (btnAction) {
            btnAction.disabled = false;
            btnAction.style.background = 'var(--bg-surface-elevated)';
            btnAction.style.color = 'var(--text-primary)';
            btnAction.style.border = '1px solid var(--border-subtle)';
            btnAction.innerHTML = '<span>✅ Đã là bản mới nhất</span>';
            btnAction.onclick = closeModal;
          }
          showToast(`✅ Bạn đang sử dụng bản mới nhất (v${data.currentVersion || '1.0.0'})!`, 'success');
          break;

        case 'dev-mode':
          if (subtitle) subtitle.textContent = data.message || 'Đang chạy trong môi trường phát triển (Dev Mode).';
          if (currentVer) currentVer.textContent = 'v' + (data.currentVersion || '1.0.0');
          if (targetVer) targetVer.textContent = 'Dev';
          if (progressWrap) progressWrap.style.display = 'none';

          if (btnAction) {
            btnAction.disabled = false;
            btnAction.style.background = 'var(--brand-primary)';
            btnAction.style.color = '#fff';
            btnAction.innerHTML = '<span>Đã hiểu</span>';
            btnAction.onclick = closeModal;
          }
          showToast('🛠 Chế độ phát triển: Khi bạn đóng gói app, tính năng sẽ tự động kích hoạt.', 'info');
          break;

        case 'error':
          if (updateModal) updateModal.style.display = 'flex';
          if (progressWrap) progressWrap.style.display = 'none';

          if (data.isNotFound) {
            if (subtitle) {
              subtitle.innerHTML = '⚠️ <strong>Chưa cấu hình kho phát hành GitHub:</strong><br><span style="font-size: 12px; color: var(--text-muted); font-weight: normal;">Kho lưu trữ GitHub Releases chưa được khởi tạo hoặc chưa có bản phát hành nào được đăng tải.</span>';
            }
            if (btnAction) {
              btnAction.disabled = false;
              btnAction.style.background = 'var(--brand-primary)';
              btnAction.style.color = '#fff';
              btnAction.innerHTML = '<span>Đã hiểu</span>';
              btnAction.onclick = closeModal;
            }
            showToast('ℹ️ Kho GitHub Releases chưa được khởi tạo trên GitHub.', 'info');
          } else {
            if (subtitle) subtitle.textContent = 'Lỗi kết nối máy chủ GitHub: ' + (data.message || 'Không thể kiểm tra.');
            if (btnAction) {
              btnAction.disabled = false;
              btnAction.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
              btnAction.style.color = '#fff';
              btnAction.innerHTML = '<span>Thử lại</span>';
              btnAction.onclick = () => {
                window.electronAPI.checkForUpdates();
              };
            }
            showToast('⚠️ Không thể kết nối đến máy chủ cập nhật GitHub.', 'error');
          }
          break;
      }
    });
  }
}
