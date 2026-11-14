import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from '/Users/mac/Downloads/Antigravity/Eco_ScienAI/node_modules/jszip/dist/jszip.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePerfectDocx() {
  const zip = new JSZip();

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>`;

  const nowIso = new Date().toISOString();
  const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>CÔNG VĂN SKY-LINE XIN MIỄN PHÍ VÉ THAM QUAN ĐẠI NỘI HUẾ</dc:title>
  <dc:creator>Hệ thống Giáo dục Sky-Line</dc:creator>
  <cp:lastModifiedBy>PDFeve Pro</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${nowIso}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${nowIso}</dcterms:modified>
</cp:coreProperties>`;

  const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Macintosh Word</Application>
  <DocSecurity>0</DocSecurity>
  <Lines>3</Lines>
  <Paragraphs>25</Paragraphs>
  <ScaleCrop>false</ScaleCrop>
  <Company>Hệ thống Giáo dục Sky-Line</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>`;

  const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
  <w:characterSpacingControl w:val="doNotCompress"/>
</w:settings>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="26"/>
        <w:szCs w:val="26"/>
        <w:lang w:val="vi-VN"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="276" w:lineRule="auto" w:after="120"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
</w:styles>`;

  // 16 Cán bộ giáo viên chính xác
  const STAFF_LIST = [
    { stt: '1', name: 'Tống Thiện Long', role: 'Hiệu trưởng / Trưởng đoàn', phone: '0935006066' },
    { stt: '2', name: 'Võ Thiện Hảo', role: 'Phó đoàn / TTCM', phone: '0387806954' },
    { stt: '3', name: 'Nguyễn Thị Mai Giang', role: 'GVCN 10/2', phone: '0338174486' },
    { stt: '4', name: 'Huỳnh Thị Mỹ Hạnh', role: 'CTHS', phone: '0989189758' },
    { stt: '5', name: 'Nguyễn Thị Bích Trâm', role: 'Y tế', phone: '0962933250' },
    { stt: '6', name: 'Nguyễn Thị Ngọc Châu', role: 'Truyền thông', phone: '0358921502' },
    { stt: '7', name: 'Cao Thị Cẩm Diệu', role: 'Truyền thông', phone: '0979482480' },
    { stt: '8', name: 'Văn Quốc Hoàng', role: 'GVCN 12/1', phone: '0793565156' },
    { stt: '9', name: 'Nguyễn Thị Hồng Thương', role: 'GVCN 12/2', phone: '0983096585' },
    { stt: '10', name: 'Nguyễn Thị Vân', role: 'GVCN 12/3', phone: '0348116822' },
    { stt: '11', name: 'Nguyễn Lương Hồng Phúc', role: 'GVCN 12INT', phone: '0336408186' },
    { stt: '12', name: 'Nguyễn Thị Hồng Nhung', role: 'GVCN 11INT', phone: '0984624597' },
    { stt: '13', name: 'Lê Thành Danh', role: 'GVCN 11/1', phone: '0906524439' },
    { stt: '14', name: 'Võ Thị Thu Sương', role: 'GVCN 10/1', phone: '0905169139' },
    { stt: '15', name: 'Nguyễn Thị Ngọc Trâm', role: 'GVCN 10INT', phone: '0964410366' },
    { stt: '16', name: 'Lê Phạm Việt Sơn', role: 'GVCN 10/3', phone: '0937147195' }
  ];

  let staffRowsXml = '';
  for (const s of STAFF_LIST) {
    staffRowsXml += `
      <w:tr>
        <w:trPr><w:cantSplit/></w:trPr>
        <w:tc>
          <w:tcPr><w:tcW w:w="800" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:before="60" w:after="60"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:lang w:val="vi-VN"/></w:rPr><w:t>${s.stt}</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="3200" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:line="240" w:lineRule="auto" w:before="60" w:after="60"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:lang w:val="vi-VN"/></w:rPr><w:t xml:space="preserve">${s.name}</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="3200" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="left"/><w:spacing w:line="240" w:lineRule="auto" w:before="60" w:after="60"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:lang w:val="vi-VN"/></w:rPr><w:t xml:space="preserve">${s.role}</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:before="60" w:after="60"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:lang w:val="vi-VN"/></w:rPr><w:t>${s.phone}</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
    `;
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <!-- TRANG 1: TIÊU NGỮ VÀ NỘI DUNG CÔNG VĂN -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9200" w:type="dxa"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>
          <w:insideH w:val="none"/><w:insideV w:val="none"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="4400"/>
        <w:gridCol w:w="4800"/>
      </w:tblGrid>
      <w:tr>
        <!-- CỘT TRÁI -->
        <w:tc>
          <w:tcPr><w:tcW w:w="4400" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>HỆ THỐNG GIÁO DỤC SKY-LINE</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>Số: ........ /CV-........</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>V/v xin miễn phí vé tham quan trải nghiệm tại Đại Nội Huế</w:t></w:r>
          </w:p>
        </w:tc>
        <!-- CỘT PHẢI -->
        <w:tc>
          <w:tcPr><w:tcW w:w="4800" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>Độc lập - Tự do - Hạnh phúc</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>Đà Nẵng, ngày 23 tháng 10 năm 2026</w:t></w:r>
          </w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <!-- KÍNH GỬI -->
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="160"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>KÍNH GỬI: TRUNG TÂM BẢO TỒN DI TÍCH CỐ ĐÔ HUẾ</w:t></w:r>
    </w:p>

    <!-- THÂN BÀI CÔNG VĂN -->
    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="100"/><w:ind w:firstLine="567"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Căn cứ vào kế hoạch giáo dục năm học 2026-2027 của Hệ thống Giáo dục Sky-Line, việc tổ chức hoạt động trải nghiệm, giáo dục ngoại khóa bổ ích cho học sinh nhằm tìm hiểu và học tập về lịch sử, văn hóa truyền thống dân tộc tại Quần thể Di tích Cố đô Huế.</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="100"/><w:ind w:firstLine="567"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Căn cứ chính sách ưu đãi, hỗ trợ miễn giảm phí tham quan của Trung tâm bảo tồn Di tích Cố đô Huế dành cho học sinh, sinh viên các trường học trên toàn quốc khi tổ chức học tập ngoại khóa có đăng ký trước.</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="100"/><w:ind w:firstLine="567"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Hệ thống Giáo dục Sky-Line kính đề nghị Ban Giám đốc Trung tâm bảo tồn Di tích Cố đô Huế xem xét, tạo điều kiện miễn phí vé tham quan Đại Nội Huế (và các điểm di tích trong lộ trình phụ thuộc nếu có) cho đoàn của nhà trường với các thông tin chi tiết dưới đây:</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="80"/><w:ind w:left="400"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>1. Địa điểm tham quan: </w:t></w:r>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Đại Nội Huế (Kinh Thành Huế).</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="80"/><w:ind w:left="400"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>2. Thời gian dự kiến: </w:t></w:r>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Ngày 28 tháng 10 năm 2026. (Từ 8h00 đến 11h30)</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="60"/><w:ind w:left="400"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>3. Thành phần tham gia đoàn: </w:t></w:r>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Tổng số lượng thành viên là 164 người, bao gồm:</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="40"/><w:ind w:left="800"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">- Số lượng học sinh: 148 em.</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="80"/><w:ind w:left="800"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">- Số lượng cán bộ, giáo viên phụ trách: 16 người.</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="60"/><w:ind w:left="400"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>4. Người đại diện phụ trách đoàn: </w:t></w:r>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Thầy Võ Thiện Hảo  Chức vụ: Tổ trưởng chuyên môn</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="100"/><w:ind w:left="400"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Điện thoại liên hệ: 0387806954</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:after="100"/><w:ind w:firstLine="567"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Nhà trường cam kết quản lý học sinh chấp hành đúng các quy định, nội quy của Khu di tích trong suốt quá trình tham quan. Kèm theo công văn này là Danh sách chi tiết các thành viên tham gia đoàn học tập ngoại khóa.</w:t></w:r>
    </w:p>

    <!-- NGẮT TRANG 1 SANG TRANG 2 -->
    <w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>

    <!-- TRANG 2: LỜI CẢM ƠN VÀ KHỐI CHỮ KÝ BAN GIÁM HIỆU -->
    <w:p>
      <w:pPr><w:jc w:val="both"/><w:spacing w:line="276" w:lineRule="auto" w:before="120" w:after="240"/><w:ind w:firstLine="567"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t xml:space="preserve">Hệ thống Giáo dục Sky-Line xin trân trọng cảm ơn sự quan tâm, phối hợp và tạo điều kiện từ Quý Cơ quan.</w:t></w:r>
    </w:p>

    <!-- BẢNG CHỮ KÝ 2 CỘT -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9200" w:type="dxa"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>
          <w:insideH w:val="none"/><w:insideV w:val="none"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="4400"/>
        <w:gridCol w:w="4800"/>
      </w:tblGrid>
      <w:tr>
        <!-- NƠI NHẬN BÊN TRÁI -->
        <w:tc>
          <w:tcPr><w:tcW w:w="4400" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:jc w:val="left"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:i/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>Nơi nhận:</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="left"/><w:spacing w:line="240" w:lineRule="auto" w:after="30"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>- Như trên;</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="left"/><w:spacing w:line="240" w:lineRule="auto" w:after="30"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>- Lưu: VT, Văn phòng trường.</w:t></w:r>
          </w:p>
        </w:tc>
        <!-- BAN GIÁM HIỆU BÊN PHẢI -->
        <w:tc>
          <w:tcPr><w:tcW w:w="4800" w:type="dxa"/></w:tcPr>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="30"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>TM. BAN GIÁM HIỆU</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>HIỆU TRƯỞNG</w:t></w:r>
          </w:p>
          <w:p>
            <w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:before="600" w:after="40"/></w:pPr>
            <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>(Ký, đóng dấu và ghi rõ họ tên)</w:t></w:r>
          </w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

    <!-- NGẮT TRANG 2 SANG TRANG 3 -->
    <w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>

    <!-- TRANG 3: BẢNG DANH SÁCH 16 CÁN BỘ GIÁO VIÊN -->
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:spacing w:line="240" w:lineRule="auto" w:after="40"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>Đính kèm Công văn số: ....... /CV-......</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:spacing w:line="240" w:lineRule="auto" w:after="160"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>Ngày 23 tháng 10 năm 2026</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="100" w:after="100"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr><w:t>HỌC TẬP NGOẠI KHÓA ĐẠI NỘI HUẾ</w:t></w:r>
    </w:p>

    <w:p>
      <w:pPr><w:jc w:val="left"/><w:spacing w:before="100" w:after="200"/></w:pPr>
      <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>I. DANH SÁCH GIÁO VIÊN VÀ CÁN BỘ PHỤ TRÁCH</w:t></w:r>
    </w:p>

    <!-- BẢNG 4 CỘT CHUẨN MICROSOFT WORD -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9200" w:type="dxa"/>
        <w:jc w:val="center"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="800"/>
        <w:gridCol w:w="3200"/>
        <w:gridCol w:w="3200"/>
        <w:gridCol w:w="2000"/>
      </w:tblGrid>
      <!-- HÀNG TIÊU ĐỀ BẢNG -->
      <w:tr>
        <w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>
        <w:tc>
          <w:tcPr><w:tcW w:w="800" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="EBF1F5"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:before="80" w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:lang w:val="vi-VN"/></w:rPr><w:t>STT</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="3200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="EBF1F5"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:before="80" w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:lang w:val="vi-VN"/></w:rPr><w:t>Họ và tên</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="3200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="EBF1F5"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:before="80" w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:lang w:val="vi-VN"/></w:rPr><w:t>Chức vụ / Nhiệm vụ</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:tcPr><w:tcW w:w="2000" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="EBF1F5"/><w:vAlign w:val="center"/></w:tcPr>
          <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:line="240" w:lineRule="auto" w:before="80" w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="24"/><w:lang w:val="vi-VN"/></w:rPr><w:t>Số điện thoại</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
      ${staffRowsXml}
    </w:tbl>

    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1418" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="720"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  zip.file("[Content_Types].xml", contentTypes);
  zip.file("_rels/.rels", rootRels);
  zip.file("docProps/core.xml", coreXml);
  zip.file("docProps/app.xml", appXml);
  zip.file("word/_rels/document.xml.rels", docRels);
  zip.file("word/settings.xml", settingsXml);
  zip.file("word/styles.xml", stylesXml);
  zip.file("word/document.xml", documentXml);

  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });

  const outPath = path.join(__dirname, 'Cong_Van_SkyLine_Hoan_Hao.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('✅ Đã tạo file Word chuẩn 100% tại:', outPath);
}

generatePerfectDocx().catch(err => {
  console.error('Lỗi:', err);
  process.exit(1);
});
