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

// Polyfill minimal browser objects
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

// Mock minimal document & canvas
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
            drawImage() {}
          };
        },
        toBlob(cb) {
          // Return a minimal valid 1x1 PNG
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
        }
      };
    }
    return {};
  }
};

// Import application modules
const { TOOLS_DATA: ALL_TOOLS } = await import('./tools-data.js');
const { pdfEngine } = await import('./pdf-engine.js');
const { ToolExecutor } = await import('./tool-executor.js');

const executor = new ToolExecutor();

async function runVerification() {
  console.log(`================================================================`);
  console.log(`BẮT ĐẦU THỬ NGHIỆM TỰ ĐỘNG TOÀN BỘ ${ALL_TOOLS.length} CÔNG CỤ CỦA PDFEVE`);
  console.log(`================================================================\n`);

  let passed = 0;
  let failed = 0;
  const results = [];

  for (let i = 0; i < ALL_TOOLS.length; i++) {
    const tool = ALL_TOOLS[i];
    const indexStr = String(i + 1).padStart(3, ' ');

    try {
      // 1. Tạo tệp mẫu tương ứng của hệ thống
      const sample = await executor.createSampleForTool(tool, 1);
      if (!sample || !sample.buffer) {
        throw new Error('Không tạo được tệp mẫu');
      }

      // Đối với các công cụ cần 2 tệp (ghép, trộn xen kẽ)
      let uploadedFiles = [sample];
      if (tool.id === 'merge-pdf' || tool.id === 'alternate-mix') {
        const sample2 = await executor.createSampleForTool(tool, 2);
        uploadedFiles.push(sample2);
      }

      // 2. Thực thi công cụ
      const res = await executor.executeTool(tool, sample.buffer, uploadedFiles, {});

      // 3. Kiểm tra tính hợp lệ của kết quả xuất (Download output check)
      if (!res || !res.blob) {
        throw new Error('Kết quả xuất ra không có Blob');
      }

      const exportedBuffer = await res.blob.arrayBuffer();
      const fileSize = exportedBuffer.byteLength || exportedBuffer.length || res.blob.size || 0;
      if (fileSize <= 0) {
        throw new Error(`Kích thước tệp xuất rỗng (0 bytes)`);
      }

      const ext = res.filename.split('.').pop().toLowerCase();

      passed++;
      results.push({
        stt: i + 1,
        id: tool.id,
        name: tool.name,
        category: tool.category,
        format: `.${ext}`,
        fileSize: `${(fileSize / 1024).toFixed(1)} KB`,
        status: 'PASS',
        filename: res.filename
      });

      console.log(`[${indexStr}/${ALL_TOOLS.length}] PASS: [${tool.category.toUpperCase()}] ${tool.name} -> ${res.filename} (${(fileSize / 1024).toFixed(1)} KB)`);
    } catch (err) {
      failed++;
      results.push({
        stt: i + 1,
        id: tool.id,
        name: tool.name,
        category: tool.category,
        format: 'ERROR',
        fileSize: '0 KB',
        status: 'FAIL',
        error: err.message
      });
      console.error(`[${indexStr}/${ALL_TOOLS.length}] FAIL: [${tool.category}] ${tool.name} (${tool.id}) -> Error: ${err.message}`);
    }
  }

  console.log(`\n================================================================`);
  console.log(`TỔNG KẾT KẾT QUẢ KIỂM THỬ 118 CÔNG CỤ PDFEVE:`);
  console.log(`- THÀNH CÔNG (PASS): ${passed} / ${ALL_TOOLS.length} (${((passed / ALL_TOOLS.length) * 100).toFixed(1)}%)`);
  console.log(`- THẤT BẠI (FAIL):   ${failed} / ${ALL_TOOLS.length}`);
  console.log(`================================================================\n`);

  fs.writeFileSync(path.join(__dirname, 'test_results.json'), JSON.stringify({ passed, failed, total: ALL_TOOLS.length, results }, null, 2));
}

runVerification().catch(e => {
  console.error('Lỗi kiểm thử:', e);
});
