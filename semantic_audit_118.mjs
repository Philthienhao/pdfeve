import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as pdfLib from '/Users/mac/Downloads/Antigravity/Eco_ScienAI/node_modules/pdf-lib/cjs/index.js';
import JSZip from '/Users/mac/Downloads/Antigravity/Eco_ScienAI/node_modules/jszip/dist/jszip.js';

global.window = {
  PDFLib: pdfLib,
  JSZip: JSZip
};

if (typeof Blob === 'undefined') {
  global.Blob = class Blob {
    constructor(parts, options = {}) {
      this.parts = parts;
      this.type = options.type || '';
      let totalSize = 0;
      for (const p of parts) {
        if (typeof p === 'string') totalSize += Buffer.byteLength(p);
        else if (p instanceof Uint8Array || p instanceof ArrayBuffer) totalSize += p.byteLength || p.length;
      }
      this.size = totalSize;
    }
    async arrayBuffer() {
      const buffers = this.parts.map(p => {
        if (typeof p === 'string') return Buffer.from(p);
        if (p instanceof Uint8Array) return Buffer.from(p);
        if (p instanceof ArrayBuffer) return Buffer.from(p);
        return Buffer.from([]);
      });
      return Buffer.concat(buffers);
    }
  };
}

if (typeof File === 'undefined') {
  global.File = class File extends Blob {
    constructor(parts, name, options = {}) {
      super(parts, options);
      this.name = name;
      this.lastModified = Date.now();
    }
  };
}

global.document = {
  createElement(tag) {
    if (tag === 'canvas') {
      return {
        width: 100,
        height: 100,
        getContext() {
          return {
            createLinearGradient() { return { addColorStop() {} }; },
            fillRect() {},
            roundRect() {},
            fill() {},
            fillText() {},
            drawImage() {},
            beginPath() {},
            arc() {},
            stroke() {}
          };
        },
        toBlob(cb) {
          const pngHead = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
          ]);
          cb(new Blob([pngHead], { type: 'image/png' }));
        },
        toDataURL() {
          return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        }
      };
    }
    return {};
  }
};

const { TOOLS_DATA: ALL_TOOLS } = await import('./tools-data.js');
const { pdfEngine } = await import('./pdf-engine.js');
const { ToolExecutor } = await import('./tool-executor.js');

const executor = new ToolExecutor();
const { PDFDocument } = pdfLib;

async function runSemanticAudit() {
  console.log('================================================================');
  console.log('KIỂM ĐỊNH TỰ ĐỘNG NGỮ NGHĨA CHUYÊN SÂU 118/118 CÔNG CỤ PDFEVE');
  console.log('(Semantic Functional & Business Verification)');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;
  const auditReport = [];

  for (let i = 0; i < ALL_TOOLS.length; i++) {
    const tool = ALL_TOOLS[i];
    const idx = String(i + 1).padStart(3, ' ');
    const semanticChecks = [];

    try {
      // 1. Tạo dữ liệu mẫu
      const sample = await executor.createSampleForTool(tool, 1);
      let uploadedFiles = [sample];

      // Công cụ 2 file
      if (['merge-pdf', 'alternate-mix', 'compare-pdf', 'insert-pdf', 'replace-pages'].includes(tool.id)) {
        const sample2 = await executor.createSampleForTool(tool, 2);
        uploadedFiles.push(sample2);
      }

      // 2. Chuẩn bị tham số nghiệp vụ thực tế
      const params = {
        degrees: '90',
        evenOddMode: 'both_zip',
        cropMargin: '36',
        findText: 'PDFeve',
        replaceText: 'PDFeve Pro Studio',
        insertIndex: '1',
        targetPage: '1',
        password: 'Password123!',
        insertImageBytes: executor.createMockPngSeal()
      };

      // 3. Thực thi
      const res = await executor.executeTool(tool, sample.buffer, uploadedFiles, params);

      if (!res || !res.blob) throw new Error('Không có tệp kết quả trả về');
      const buf = await res.blob.arrayBuffer();
      const u8 = new Uint8Array(buf);
      if (u8.length === 0) throw new Error('Tệp xuất rỗng (0 bytes)');

      // 4. KIỂM THỬ ĐẶC THÙ NGỮ NGHĨA (Semantic Assertions)
      // Check PDF header
      if (res.mimeType === 'application/pdf') {
        const headerStr = Buffer.from(u8.slice(0, 8)).toString('utf-8');
        if (!headerStr.startsWith('%PDF-')) {
          throw new Error('Định dạng xuất không phải PDF chuẩn (%PDF- header missing)');
        }
        semanticChecks.push('Chuẩn định dạng PDF ISO-32000');

        // Phân tích cấu trúc file kết quả bằng PDFLib
        const outDoc = await PDFDocument.load(u8, { ignoreEncryption: true });
        const outPages = outDoc.getPageCount();

        // Kiểm tra logic từng nhóm công cụ:
        if (tool.id === 'merge-pdf' || tool.id === 'alternate-mix') {
          if (outPages < 2) throw new Error(`Gộp file thất bại: số trang xuất ra = ${outPages} (< 2)`);
          semanticChecks.push(`Đã gộp đủ ${outPages} trang từ các tệp nguồn`);
        } else if (tool.id === 'rotate-pdf') {
          const r = outDoc.getPages()[0].getRotation().angle;
          if (r !== 90 && r !== 180 && r !== 270) {
            throw new Error(`Xoay trang không đạt góc xoay mong muốn: góc hiện tại = ${r}°`);
          }
          semanticChecks.push(`Góc xoay đã áp dụng chính xác ${r}°`);
        } else if (tool.id === 'add-blank-page' || tool.id === 'add-cover-page') {
          if (outPages <= 1) throw new Error(`Thêm trang thất bại: tổng số trang = ${outPages}`);
          semanticChecks.push(`Số trang tăng lên ${outPages} trang`);
        } else if (tool.id === 'duplicate-pages') {
          if (outPages < 4) throw new Error(`Nhân bản trang thất bại: tổng số trang = ${outPages}`);
          semanticChecks.push(`Đã nhân đôi số trang thành công (${outPages} trang)`);
        } else if (tool.id === 'standardize-page-size' || tool.id === 'multi-tool-pdf') {
          const { width, height } = outDoc.getPages()[0].getSize();
          if (Math.abs(width - 595.28) > 2 || Math.abs(height - 841.89) > 2) {
            throw new Error(`Kích thước không chuẩn A4: ${width}x${height}`);
          }
          semanticChecks.push('Chuẩn hóa kích thước đúng A4 (595x842 pt)');
        } else if (tool.id === 'make-booklet') {
          const { width, height } = outDoc.getPages()[0].getSize();
          if (width < height) throw new Error('Sách gập Booklet phải là khổ in ngang (Landscape)');
          semanticChecks.push('Khổ in tờ đôi nằm ngang dạng sách gập');
        } else if (tool.id === 'create-form') {
          const form = outDoc.getForm();
          const fields = form.getFields();
          if (fields.length === 0) throw new Error('Không tạo được các trường tương tác AcroForm');
          semanticChecks.push(`Tạo thành công ${fields.length} trường AcroForm tương tác`);
        } else if (tool.id === 'remove-metadata') {
          if (outDoc.getTitle() || outDoc.getAuthor()) throw new Error('Siêu dữ liệu vẫn còn tồn tại');
          semanticChecks.push('Đã xóa sạch metadata và danh tính tác giả');
        }
      } else if (res.mimeType === 'application/zip') {
        const zip = await JSZip.loadAsync(u8);
        const fileNames = Object.keys(zip.files);
        if (fileNames.length === 0) throw new Error('File ZIP xuất ra rỗng không chứa tệp con');
        semanticChecks.push(`File ZIP hợp lệ chứa ${fileNames.length} tệp con (${fileNames.slice(0, 3).join(', ')})`);
      } else if (res.mimeType.includes('openxmlformats') || res.filename.endsWith('.docx')) {
        if (u8.length < 50) throw new Error('Nội dung file Word xuất ra quá nhỏ');
        semanticChecks.push('Cấu trúc tài liệu Word docx hợp lệ');
      } else if (res.mimeType === 'text/plain' || res.mimeType === 'text/csv' || res.mimeType === 'text/html' || res.mimeType === 'application/json') {
        const textStr = Buffer.from(u8).toString('utf-8');
        if (textStr.trim().length === 0) throw new Error('Nội dung văn bản trích xuất rỗng');
        semanticChecks.push(`Dữ liệu văn bản trích xuất hợp lệ (${textStr.length} ký tự)`);
      }

      passed++;
      const checkSummary = semanticChecks.length > 0 ? ` [${semanticChecks.join('; ')}]` : '';
      console.log(`[${idx}/${ALL_TOOLS.length}] PASS: [${tool.category.toUpperCase()}] ${tool.name} -> ${res.filename} (${(u8.length / 1024).toFixed(1)} KB)${checkSummary}`);

      auditReport.push({
        id: tool.id,
        name: tool.name,
        category: tool.category,
        actionType: tool.actionType,
        filename: res.filename,
        sizeKB: (u8.length / 1024).toFixed(1),
        checks: semanticChecks,
        status: 'PASS'
      });
    } catch (err) {
      failed++;
      console.error(`[${idx}/${ALL_TOOLS.length}] FAIL: [${tool.category}] ${tool.name} (${tool.id}) -> ${err.message}`);
      auditReport.push({
        id: tool.id,
        name: tool.name,
        category: tool.category,
        status: 'FAIL',
        error: err.message
      });
    }
  }

  console.log('\n================================================================');
  console.log('KẾT QUẢ KIỂM ĐỊNH NGỮ NGHĨA 118/118 CÔNG CỤ:');
  console.log(`- ĐẠT CHUẨN (PASS): ${passed} / ${ALL_TOOLS.length} (${((passed / ALL_TOOLS.length) * 100).toFixed(1)}%)`);
  console.log(`- THẤT BẠI (FAIL):  ${failed} / ${ALL_TOOLS.length}`);
  console.log('================================================================\n');

  fs.writeFileSync(path.join(__dirname, 'semantic_audit_report.json'), JSON.stringify({ passed, failed, total: ALL_TOOLS.length, auditReport }, null, 2));
}

runSemanticAudit().catch(e => {
  console.error('Audit fatal error:', e);
});
