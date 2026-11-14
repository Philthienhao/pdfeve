#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDFeve High-Fidelity Universal PDF to Word (DOCX) Converter Engine
Rã từng chi tiết có thể chỉnh sửa 100% trong Microsoft Word:
1. TÀI LIỆU VĂN BẢN HÀNH CHÍNH (Flow Document):
   - Giữ nguyên 100% Header logo trong suốt (smask RGBA), Footer chân trang, Watermark chìm.
   - Thụt lề đầu dòng chuẩn hành chính (0.5 inch / 720 dxa), in đậm, in nghiêng, căn giữa tiêu đề.
   - Bảng biểu và chữ ký căn chỉnh chuẩn xác, văn bản chỉnh sửa tự nhiên trong Word.

2. TÀI LIỆU ĐỒ HỌA PHỨC TẠP / POSTER / INFOGRAPHIC / SLIDE / CANVA (Decomposed Editable 2D Canvas):
   - Tự động bóc tách (rã) toàn bộ văn bản thành từng hộp chữ (Word Text Box) có thể nhấp chuột chỉnh sửa, bôi đen, sao chép, gõ văn bản mới trực tiếp trong Microsoft Word.
   - Giữ nguyên 100% toàn bộ vector hình học (khung thẻ màu, badge, biểu đồ tròn, đường nét, ảnh minh họa, mã QR) ở độ phân giải siêu nét chuẩn in ấn 300 DPI.
   - Xóa bỏ văn bản gốc ở lớp nền để loại bỏ hoàn toàn hiện tượng bóng ma (ghosting) hay chữ đè chữ khi người dùng chỉnh sửa.
   - Giữ nguyên số trang chuẩn (1 trang giữ nguyên 1 trang, không bị tràn hay nhảy dòng).
"""

import sys
import os
import io
import re
import html
import zipfile
import unicodedata
import fitz  # PyMuPDF

def pt_to_emu(pt):
    return int(round(pt * 12700))

def pt_to_dxa(pt):
    return int(round(pt * 20))

def clean_xml(text):
    if not text:
        return ""
    text = unicodedata.normalize('NFC', text)
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    return html.escape(text)

def rgb_to_hex(color_int):
    if color_int is None or color_int == 0:
        return "000000"
    r = (color_int >> 16) & 0xFF
    g = (color_int >> 8) & 0xFF
    b = color_int & 0xFF
    return f"{r:02X}{g:02X}{b:02X}"

def detect_font_family(font_name):
    if not font_name:
        return "Arial"
    fn = font_name.lower()
    if 'times' in fn or 'roman' in fn or 'serif' in fn: return "Times New Roman"
    if 'courier' in fn or 'mono' in fn: return "Courier New"
    # Toàn bộ phông chữ không chân (Montserrat, Roboto, Segoe UI, Calibri, Open Sans, Arial...)
    # đều được gán về Arial để bảo đảm 100% hỗ trợ tiếng Việt Unicode có dấu chuẩn (dấu mũ, ngã, hỏi, nặng, móc)
    # trên mọi phiên bản Microsoft Word (Mac, Windows, iOS, Web) mà không bao giờ bị lỗi mất dấu
    return "Arial"

def is_page_complex(page):
    """
    Tự động phát hiện trang PDF có phải là thiết kế đồ họa phức tạp / Poster / Infographic / Slide không:
    - Mật độ nét vẽ vector (drawings) cao (hộp thẻ, đường viền, icon màu, badge...)
    - Các khối văn bản phân bổ theo lưới 2D nhiều cột (tọa độ Y nhảy cóc)
    - Số lượng ảnh và khối văn bản đan xen dày đặc
    """
    drawings = page.get_drawings()
    imgs = page.get_images()
    text_dict = page.get_text('dict')
    blocks = [b for b in text_dict.get('blocks', []) if 'lines' in b]
    
    y_pos = [b['bbox'][1] for b in blocks]
    out_of_order = sum(1 for k in range(len(y_pos)-1) if y_pos[k+1] < y_pos[k] - 25 and len(blocks) > 10)
    
    if len(drawings) >= 15:
        return True
    if out_of_order >= 4:
        return True
    if len(blocks) >= 45:
        return True
    if len(imgs) >= 5 and len(blocks) >= 20:
        return True
    return False

def create_clean_background_doc(doc):
    """
    Tạo bản sao PDF trong bộ nhớ và loại bỏ toàn bộ các toán tử vẽ chữ BT...ET
    trên các stream nội dung và Form XObject (loại trừ các stream ảnh raster).
    Điều này tạo ra một lớp nền đồ họa hoàn toàn sạch chữ (graphics-only canvas),
    giữ nguyên 100% vector shape, card, badge, thanh phân cách, logo, ảnh chụp, QR code.
    Nhờ vậy khi phủ các Text Box của Word lên trên, văn bản chỉ hiển thị đúng 1 lần duy nhất,
    loại bỏ triệt để 100% lỗi nhân đôi / bóng ma / đè chữ.
    """
    doc_clean = fitz.open()
    doc_clean.insert_pdf(doc)
    for xref in range(1, doc_clean.xref_length()):
        try:
            if doc_clean.xref_is_image(xref):
                continue
            obj = doc_clean.xref_object(xref)
            if '/Subtype /Image' in obj or '/Subtype/Image' in obj:
                continue
            stream = doc_clean.xref_stream(xref)
            if stream and b'BT' in stream:
                new_stream = re.sub(rb'(?s)\bBT\b.*?\bET\b', b'', stream)
                if new_stream != stream:
                    doc_clean.update_stream(xref, new_stream)
        except Exception:
            pass
    return doc_clean

def convert_complex_pdf_to_docx(doc, docx_output=None):
    """
    Chế độ Decomposed Editable 2D Canvas:
    Rã từng khối chữ thành Text Box chỉnh sửa được 100%, bảo toàn nền vector và ảnh gốc 300 DPI
    """
    total_pages = len(doc)
    doc_clean = create_clean_background_doc(doc)
    zip_buffer = io.BytesIO()
    zip_out = zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED)

    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""
    zip_out.writestr('[Content_Types].xml', content_types)

    root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""
    zip_out.writestr('_rels/.rels', root_rels)

    p0 = doc[0]
    first_text = p0.get_text().strip().split('\n')[0].strip() if p0.get_text() else "Tài liệu đồ họa PDFeve"
    doc_title = clean_xml(first_text)
    core_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>{doc_title}</dc:title>
  <cp:lastModifiedBy>PDFeve Pro</cp:lastModifiedBy>
</cp:coreProperties>"""
    zip_out.writestr('docProps/core.xml', core_xml)

    app_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Macintosh Word</Application>
  <DocSecurity>0</DocSecurity>
</Properties>"""
    zip_out.writestr('docProps/app.xml', app_xml)

    settings_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
  <w:characterSpacingControl w:val="doNotCompress"/>
</w:settings>"""
    zip_out.writestr('word/settings.xml', settings_xml)

    styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="20"/></w:rPr></w:rPrDefault>
  </w:docDefaults>
</w:styles>"""
    zip_out.writestr('word/styles.xml', styles_xml)

    doc_rels = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
        '  <Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>',
        '  <Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>'
    ]

    body_elements = []
    box_id_counter = 100

    for idx in range(total_pages):
        p = doc[idx]
        bg_page = doc_clean[idx]
        pw_pt, ph_pt = p.rect.width, p.rect.height
        pw_dxa = pt_to_dxa(pw_pt)
        ph_dxa = pt_to_dxa(ph_pt)
        pw_emu = pt_to_emu(pw_pt)
        ph_emu = pt_to_emu(ph_pt)
        orient_attr = 'w:orient="landscape"' if pw_pt > ph_pt else ''

        # 1. KẾT XUẤT NỀN ĐỒ HỌA GỐC 300 DPI ĐÃ LÀM SẠCH CHỮ (0% CHỮ THỪA)
        # Nền giữ nguyên 100% vector shape, card, icon, logo, QR code, ảnh chụp nhưng KHÔNG có chữ
        # Nhờ đó Text Box của Word là lớp chữ DUY NHẤT, loại bỏ hoàn toàn lỗi đè / nhân đôi chữ
        pix = bg_page.get_pixmap(dpi=300)
        img_bytes = pix.tobytes("png")

        img_name = f"page_bg_{idx + 1}.png"
        zip_out.writestr(f"word/media/{img_name}", img_bytes)

        r_id_bg = f"rIdBgPage{idx + 1}"
        doc_rels.append(f'  <Relationship Id="{r_id_bg}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/{img_name}"/>')

        # 2. BÓC TÁCH TOÀN BỘ CÁC DÒNG CHỮ THÀNH TỪNG TEXTBOX CHỈNH SỬA ĐƯỢC
        p_dict = p.get_text('dict')
        raw_lines = []
        for b in p_dict.get('blocks', []):
            if 'lines' in b:
                for l in b['lines']:
                    txt = ''.join(s['text'] for s in l['spans']).strip()
                    if txt:
                        raw_lines.append(l)

        txbx_drawings = []
        for l in raw_lines:
            lx0, ly0, lx1, ly1 = l['bbox']
            # Tăng biên độ trên (y) và chiều cao (lh) để các chữ in hoa có dấu mũ (Ấ, Ế, Ố, Ồ, Ề, Ẩ, Ễ...)
            # có khoảng không trọn vẹn, không bao giờ bị mép trên của Text Box cắt cụt mất dấu / mất mũ
            lw = max(24.0, (lx1 - lx0) * 1.15 + 16.0)
            lh = max(16.0, (ly1 - ly0) + 7.0)
            x_emu = int(round((lx0 - 1.0) * 12700))
            y_emu = int(round((ly0 - 3.5) * 12700))
            w_emu = int(round(lw * 12700))
            h_emu = int(round(lh * 12700))

            # Lan truyền màu văn bản sang khoảng trắng liền kề để gộp mượt mà
            spans = l['spans']
            for si in range(len(spans)):
                if not spans[si]['text'].strip():
                    if si > 0 and spans[si-1]['text'].strip():
                        spans[si]['color'] = spans[si-1]['color']
                    elif si+1 < len(spans) and spans[si+1]['text'].strip():
                        spans[si]['color'] = spans[si+1]['color']

            # Hợp nhất các span liên tiếp có cùng định dạng (font, size, color, bold, italic)
            merged_spans = []
            for s in spans:
                txt = s['text']
                if not txt: continue
                sz = int(round(s.get('size', 10) * 2))
                color = f"{s['color']:06X}" if s.get('color') else "000000"
                bold = bool('bold' in s.get('font', '').lower() or (s.get('flags', 0) & 16))
                italic = bool('italic' in s.get('font', '').lower() or (s.get('flags', 0) & 2))
                fname = detect_font_family(s.get('font', ''))
                key = (fname, sz, color, bold, italic)
                if merged_spans and merged_spans[-1]['key'] == key:
                    merged_spans[-1]['text'] += txt
                else:
                    merged_spans.append({'key': key, 'text': txt})

            runs_xml = []
            for ms in merged_spans:
                fname, sz, color, bold, italic = ms['key']
                b_tag = "<w:b/><w:bCs/>" if bold else ""
                i_tag = "<w:i/><w:iCs/>" if italic else ""
                # Chuẩn hóa Unicode NFC để đảm bảo chữ in hoa tiếng Việt có dấu chuẩn nguyên khối
                norm_txt = unicodedata.normalize('NFC', ms['text'])
                t_val = html.escape(norm_txt)
                runs_xml.append(f'<w:r><w:rPr><w:rFonts w:ascii="{fname}" w:hAnsi="{fname}" w:cs="{fname}"/><w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/><w:color w:val="{color}"/>{b_tag}{i_tag}<w:lang w:val="vi-VN"/></w:rPr><w:t xml:space="preserve">{t_val}</w:t></w:r>')

            if not runs_xml: continue

            box_id_counter += 1
            txbx_drawings.append(f"""
            <w:r>
              <w:drawing>
                <wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="251658240" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1">
                  <wp:simplePos x="0" y="0"/>
                  <wp:positionH relativeFrom="page"><wp:posOffset>{x_emu}</wp:posOffset></wp:positionH>
                  <wp:positionV relativeFrom="page"><wp:posOffset>{y_emu}</wp:posOffset></wp:positionV>
                  <wp:extent cx="{w_emu}" cy="{h_emu}"/>
                  <wp:wrapNone/>
                  <wp:docPr id="{box_id_counter}" name="Text_{box_id_counter}"/>
                  <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                    <a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                      <wps:wsp xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
                        <wps:cNvSpPr txBox="1"/>
                        <wps:spPr>
                          <a:xfrm><a:off x="0" y="0"/><a:ext cx="{w_emu}" cy="{h_emu}"/></a:xfrm>
                          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                          <a:noFill/>
                          <a:ln><a:noFill/></a:ln>
                        </wps:spPr>
                        <wps:txbx>
                          <w:txbxContent>
                            <w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>{''.join(runs_xml)}</w:p>
                          </w:txbxContent>
                        </wps:txbx>
                        <wps:bodyPr lIns="0" tIns="0" rIns="0" bIns="0" wrap="none" vert="horz"/>
                      </wps:wsp>
                    </a:graphicData>
                  </a:graphic>
                </wp:anchor>
              </w:drawing>
            </w:r>""")

        sect_xml = f"""<w:sectPr>
          <w:pgSz w:w="{pw_dxa}" w:h="{ph_dxa}" {orient_attr}/>
          <w:pgMar w:top="0" w:right="0" w:bottom="0" w:left="0" w:header="0" w:footer="0" w:gutter="0"/>
        </w:sectPr>"""

        bg_drawing_xml = f"""<w:r>
            <w:drawing>
              <wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="0" behindDoc="1" locked="1" layoutInCell="1" allowOverlap="1">
                <wp:simplePos x="0" y="0"/>
                <wp:positionH relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionH>
                <wp:positionV relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionV>
                <wp:extent cx="{pw_emu}" cy="{ph_emu}"/>
                <wp:wrapNone/>
                <wp:docPr id="{idx + 1}" name="PageCanvas_{idx + 1}"/>
                <wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>
                <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                  <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                    <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                      <pic:nvPicPr><pic:cNvPr id="{idx + 1}" name="PageCanvas_{idx + 1}"/><pic:cNvPicPr/></pic:nvPicPr>
                      <pic:blipFill><a:blip r:embed="{r_id_bg}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
                      <pic:spPr>
                        <a:xfrm><a:off x="0" y="0"/><a:ext cx="{pw_emu}" cy="{ph_emu}"/></a:xfrm>
                        <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                      </pic:spPr>
                    </pic:pic>
                  </a:graphicData>
                </a:graphic>
              </wp:anchor>
            </w:drawing>
          </w:r>"""

        if idx < total_pages - 1:
            body_elements.append(f"""<w:p>
          <w:pPr><w:spacing w:before="0" w:after="0"/>{sect_xml}</w:pPr>
          {bg_drawing_xml}
          {''.join(txbx_drawings)}
        </w:p>""")
        else:
            body_elements.append(f"""<w:p>
          <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
          {bg_drawing_xml}
          {''.join(txbx_drawings)}
        </w:p>
        {sect_xml}""")

    doc_rels.append('</Relationships>')
    zip_out.writestr('word/_rels/document.xml.rels', '\n'.join(doc_rels))

    document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
            xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
            xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape">
  <w:body>
    {''.join(body_elements)}
  </w:body>
</w:document>"""
    zip_out.writestr('word/document.xml', document_xml)
    zip_out.close()

    docx_bytes = zip_buffer.getvalue()
    if docx_output:
        if isinstance(docx_output, (str, os.PathLike)):
            with open(docx_output, 'wb') as f:
                f.write(docx_bytes)
        elif hasattr(docx_output, 'write'):
            docx_output.write(docx_bytes)
    return docx_bytes

def convert_flow_pdf_to_docx(doc, docx_output=None):
    """
    Chế độ Standard Administrative Flow:
    Bảo toàn toàn bộ định dạng văn bản hành chính, Header, Footer, Watermark, thụt lề, bảng chữ ký
    """
    total_pages = len(doc)
    page0 = doc[0]
    p_rect = page0.rect
    page_w_pt = p_rect.width
    page_h_pt = p_rect.height
    page_w_dxa = pt_to_dxa(page_w_pt)
    page_h_dxa = pt_to_dxa(page_h_pt)

    zip_buffer = io.BytesIO()
    zip_out = zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED)

    media_counter = 1
    media_files = {}
    page_images = {p: [] for p in range(total_pages)}

    for p_idx in range(total_pages):
        page = doc[p_idx]
        imgs = page.get_images(full=True)
        for img_info in imgs:
            xref = img_info[0]
            smask = img_info[1]
            if xref not in media_files:
                try:
                    pix = fitz.Pixmap(doc, xref)
                    if pix.n >= 5:
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    if smask > 0:
                        mask = fitz.Pixmap(doc, smask)
                        pix = fitz.Pixmap(pix, mask)
                    img_bytes = pix.tobytes("png")
                    ext = "png"
                except Exception as e:
                    base_img = doc.extract_image(xref)
                    ext = base_img.get("ext", "png")
                    if ext == "jpeg": ext = "jpg"
                    img_bytes = base_img["image"]

                media_name = f"image_{media_counter}.{ext}"
                media_counter += 1
                media_files[xref] = {
                    "name": media_name,
                    "bytes": img_bytes,
                    "ext": ext
                }
                zip_out.writestr(f"word/media/{media_name}", img_bytes)

            rects = page.get_image_rects(xref)
            bbox = rects[0] if rects else fitz.Rect(0, 0, 100, 100)

            is_watermark = (bbox.width > page_w_pt * 0.6 and bbox.height > page_h_pt * 0.4)
            is_header = (bbox.y0 < page_h_pt * 0.18 and bbox.height < 150 and not is_watermark)
            is_footer = (bbox.y1 > page_h_pt * 0.80 and bbox.height < 180 and not is_watermark)

            page_images[p_idx].append({
                "xref": xref,
                "media_name": media_files[xref]["name"],
                "ext": media_files[xref]["ext"],
                "bbox": bbox,
                "is_watermark": is_watermark,
                "is_header": is_header,
                "is_footer": is_footer,
                "x_emu": pt_to_emu(bbox.x0),
                "y_emu": pt_to_emu(bbox.y0),
                "w_emu": pt_to_emu(bbox.width),
                "h_emu": pt_to_emu(bbox.height),
            })

    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""
    zip_out.writestr('[Content_Types].xml', content_types)

    root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""
    zip_out.writestr('_rels/.rels', root_rels)

    doc_title = clean_xml(page0.get_text().split("\n")[0].strip() if page0.get_text() else "Tài liệu chuyển đổi")
    core_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>{doc_title}</dc:title>
  <cp:lastModifiedBy>PDFeve Pro</cp:lastModifiedBy>
</cp:coreProperties>"""
    zip_out.writestr('docProps/core.xml', core_xml)

    app_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Macintosh Word</Application>
  <DocSecurity>0</DocSecurity>
</Properties>"""
    zip_out.writestr('docProps/app.xml', app_xml)

    doc_rels = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
        '  <Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>',
        '  <Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>'
    ]
    img_rids = {}
    rid_count = 10
    for xref, info in media_files.items():
        r_id = f"rIdImg{rid_count}"
        rid_count += 1
        img_rids[xref] = r_id
        doc_rels.append(f'  <Relationship Id="{r_id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/{info["name"]}"/>')

    doc_rels.append('</Relationships>')
    zip_out.writestr('word/_rels/document.xml.rels', '\n'.join(doc_rels))

    settings_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
  <w:characterSpacingControl w:val="doNotCompress"/>
</w:settings>"""
    zip_out.writestr('word/settings.xml', settings_xml)

    styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
        <w:spacing w:line="276" w:lineRule="auto" w:after="80"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>"""
    zip_out.writestr('word/styles.xml', styles_xml)

    all_spans = []
    for p_idx in range(total_pages):
        page = doc[p_idx]
        bks = page.get_text('dict')['blocks']
        for b in bks:
            if 'lines' in b:
                for l in b['lines']:
                    for s in l['spans']:
                        if s['text'].strip():
                            all_spans.append(s)

    min_x = min((s['bbox'][0] for s in all_spans), default=72.0)
    max_x = max((s['bbox'][2] for s in all_spans), default=page_w_pt - 72.0)
    left_mar_pt = max(36.0, min(72.0, min_x))
    right_mar_pt = max(36.0, min(72.0, page_w_pt - max_x))

    top_mar_pt = 72.0
    bot_mar_pt = 72.0
    if page_images[0]:
        hdrs = [img for img in page_images[0] if img['is_header']]
        ftrs = [img for img in page_images[0] if img['is_footer']]
        if hdrs:
            top_mar_pt = max(54.0, hdrs[0]['bbox'].y1 + 18.0)
        if ftrs:
            bot_mar_pt = max(54.0, page_h_pt - ftrs[0]['bbox'].y0 + 18.0)

    top_mar_dxa = pt_to_dxa(top_mar_pt)
    bot_mar_dxa = pt_to_dxa(bot_mar_pt)
    left_mar_dxa = pt_to_dxa(left_mar_pt)
    right_mar_dxa = pt_to_dxa(right_mar_pt)

    body_elements = []

    for p_idx in range(total_pages):
        page = doc[p_idx]
        if p_idx > 0:
            body_elements.append('<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>')

        p_imgs = page_images[p_idx]
        if p_imgs:
            img_drawings_xml = []
            doc_pr_id = (p_idx + 1) * 1000

            sorted_imgs = sorted(p_imgs, key=lambda x: 0 if x['is_watermark'] else 1)
            for im in sorted_imgs:
                doc_pr_id += 1
                r_id = img_rids[im['xref']]
                behind_doc = "1" if im['is_watermark'] else "0"
                rel_height = "0" if im['is_watermark'] else "251658240"
                name_lbl = "Watermark" if im['is_watermark'] else ("HeaderLogo" if im['is_header'] else ("FooterBanner" if im['is_footer'] else "Image"))

                img_drawings_xml.append(f"""
                <w:r>
                  <w:drawing>
                    <wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="{rel_height}" behindDoc="{behind_doc}" locked="1" layoutInCell="1" allowOverlap="1">
                      <wp:simplePos x="0" y="0"/>
                      <wp:positionH relativeFrom="page"><wp:posOffset>{im['x_emu']}</wp:posOffset></wp:positionH>
                      <wp:positionV relativeFrom="page"><wp:posOffset>{im['y_emu']}</wp:posOffset></wp:positionV>
                      <wp:extent cx="{im['w_emu']}" cy="{im['h_emu']}"/>
                      <wp:effectExtent l="0" t="0" r="0" b="0"/>
                      <wp:wrapNone/>
                      <wp:docPr id="{doc_pr_id}" name="{name_lbl}_{doc_pr_id}"/>
                      <wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>
                      <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                          <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                            <pic:nvPicPr><pic:cNvPr id="{doc_pr_id}" name="{name_lbl}_{doc_pr_id}"/><pic:cNvPicPr/></pic:nvPicPr>
                            <pic:blipFill><a:blip r:embed="{r_id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
                            <pic:spPr>
                              <a:xfrm><a:off x="0" y="0"/><a:ext cx="{im['w_emu']}" cy="{im['h_emu']}"/></a:xfrm>
                              <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                            </pic:spPr>
                          </pic:pic>
                        </a:graphicData>
                      </a:graphic>
                    </wp:anchor>
                  </w:drawing>
                </w:r>""")

            body_elements.append(f'<w:p><w:pPr><w:spacing w:before="0" w:after="0"/><w:jc w:val="left"/></w:pPr>{"".join(img_drawings_xml)}</w:p>')

        page_dict = page.get_text('dict')
        blocks = page_dict.get('blocks', [])

        content_blocks = []
        for b in blocks:
            if 'lines' not in b: continue
            b_text = "".join("".join(s['text'] for s in l['spans']) for l in b['lines']).strip()
            if not b_text: continue
            bbox = b['bbox']
            if bbox[3] < 60 and page_images[p_idx]: continue
            if bbox[1] > page_h_pt - 50 and page_images[p_idx]: continue
            content_blocks.append(b)

        i = 0
        while i < len(content_blocks):
            b = content_blocks[i]
            b_text = " ".join("".join(s['text'] for s in l['spans']) for l in b['lines']).strip()
            bbox = b['bbox']

            is_date_or_signer = (bbox[0] > page_w_pt * 0.45 and (
                re.search(r'ngày\s+\d+\s+tháng\s+\d+\s+năm', b_text, re.I) or
                re.search(r'GIÁM\s*ĐỐC|HIỆU\s*TRƯỞNG|TRƯỞNG\s*KHOA|CHỦ\s*TỊCH|GIÁM\s*ĐỐC\s*CƠ\s*SỞ', b_text, re.I)
            ))

            if is_date_or_signer and i + 1 < len(content_blocks):
                sig_group = [b]
                j = i + 1
                while j < len(content_blocks):
                    next_b = content_blocks[j]
                    next_text = " ".join("".join(s['text'] for s in l['spans']) for l in next_b['lines']).strip()
                    next_bbox = next_b['bbox']
                    if next_bbox[0] < page_w_pt * 0.35 and len(next_text) > 5:
                        break
                    sig_group.append(next_b)
                    j += 1

                table_xml = ['<w:tbl>', '  <w:tblPr>', '    <w:tblW w:w="9200" w:type="dxa"/>', '    <w:jc w:val="center"/>',
                             '    <w:tblBorders>', '      <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>',
                             '      <w:insideH w:val="none"/><w:insideV w:val="none"/>', '    </w:tblBorders>', '  </w:tblPr>',
                             '  <w:tblGrid><w:gridCol w:w="4200"/><w:gridCol w:w="5000"/></w:tblGrid>',
                             '  <w:tr>', '    <w:tc><w:tcPr><w:tcW w:w="4200" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r><w:t></w:t></w:r></w:p></w:tc>',
                             '    <w:tc><w:tcPr><w:tcW w:w="5000" w:type="dxa"/></w:tcPr>']

                for sb_idx, sb in enumerate(sig_group):
                    sb_text = " ".join("".join(s['text'] for s in l['spans']) for l in sb['lines']).strip()
                    first_s = sb['lines'][0]['spans'][0]
                    font_name = first_s['font']
                    flags = first_s['flags']
                    is_b = bool(flags & 16) or 'bold' in font_name.lower() or sb_text.isupper()
                    is_it = bool(flags & 2) or 'italic' in font_name.lower() or 'ngày' in sb_text.lower()
                    sz_val = int(round(first_s['size'] * 2))

                    before_sp = "680" if (sb_idx == len(sig_group) - 1 and len(sig_group) > 2) else "0"
                    after_sp = "60"

                    bold_tag = "<w:b/><w:bCs/>" if is_b else ""
                    italic_tag = "<w:i/><w:iCs/>" if is_it else ""

                    table_xml.append(f"""
                      <w:p>
                        <w:pPr>
                          <w:jc w:val="center"/>
                          <w:spacing w:before="{before_sp}" w:after="{after_sp}" w:line="240" w:lineRule="auto"/>
                        </w:pPr>
                        <w:r>
                          <w:rPr>
                            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                            {bold_tag}
                            {italic_tag}
                            <w:sz w:val="{sz_val}"/><w:szCs w:val="{sz_val}"/>
                            <w:lang w:val="vi-VN"/>
                          </w:rPr>
                          <w:t xml:space="preserve">{clean_xml(sb_text)}</w:t>
                        </w:r>
                      </w:p>
                    """)

                table_xml.extend(['    </w:tc>', '  </w:tr>', '</w:tbl>'])
                body_elements.append('\n'.join(table_xml))
                i = j
                continue

            mid_x = (bbox[0] + bbox[2]) / 2.0
            is_centered = (abs(mid_x - page_w_pt / 2.0) < 60) and (bbox[2] - bbox[0] < page_w_pt * 0.75)
            is_title = is_centered and (b_text.isupper() or len(b_text) < 100) and (bbox[1] < page_h_pt * 0.35)

            is_recipient = b_text.lower().startswith('kính gửi') or b_text.lower().startswith('kinh gui')
            is_closing = b_text.lower().startswith('kính chúc') or b_text.lower().startswith('trân trọng')

            align_val = "center" if (is_centered or is_title) else "both"
            if is_recipient or is_closing:
                align_val = "left"

            indent_xml = ""
            if align_val == "both" and not is_title:
                indent_xml = '<w:ind w:firstLine="720"/>'
            elif is_recipient or is_closing:
                indent_xml = '<w:ind w:firstLine="720"/>'

            before_sp = "160" if is_title else "0"
            after_sp = "120" if is_title else "80"

            p_runs = []
            for l in b['lines']:
                for s in l['spans']:
                    s_txt = clean_xml(s['text'])
                    if not s_txt: continue
                    f_name = s['font']
                    flags = s['flags']
                    sz = int(round(s['size'] * 2))
                    col_hex = rgb_to_hex(s['color'])

                    is_b = bool(flags & 16) or 'bold' in f_name.lower() or is_title or (is_recipient and 'kính gửi' in s_txt.lower())
                    is_it = bool(flags & 2) or 'italic' in f_name.lower() or 'oblique' in f_name.lower()

                    bold_tag = "<w:b/><w:bCs/>" if is_b else ""
                    italic_tag = "<w:i/><w:iCs/>" if is_it else ""
                    color_tag = f'<w:color w:val="{col_hex}"/>' if col_hex != "000000" else ""

                    p_runs.append(f"""
                      <w:r>
                        <w:rPr>
                          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                          {bold_tag}
                          {italic_tag}
                          {color_tag}
                          <w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/>
                          <w:lang w:val="vi-VN"/>
                        </w:rPr>
                        <w:t xml:space="preserve">{s_txt}</w:t>
                      </w:r>
                    """)

            if p_runs:
                para_xml = f"""
                  <w:p>
                    <w:pPr>
                      <w:jc w:val="{align_val}"/>
                      <w:spacing w:before="{before_sp}" w:after="{after_sp}" w:line="276" w:lineRule="auto"/>
                      {indent_xml}
                    </w:pPr>
                    {''.join(p_runs)}
                  </w:p>
                """
                body_elements.append(para_xml)

            i += 1

    sect_pr = f"""
      <w:sectPr>
        <w:pgSz w:w="{page_w_dxa}" w:h="{page_h_dxa}"/>
        <w:pgMar w:top="{top_mar_dxa}" w:right="{right_mar_dxa}" w:bottom="{bot_mar_dxa}" w:left="{left_mar_dxa}" w:header="0" w:footer="0" w:gutter="0"/>
        <w:cols w:space="720"/>
        <w:docGrid w:linePitch="360"/>
      </w:sectPr>"""

    document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
            xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    {''.join(body_elements)}
    {sect_pr}
  </w:body>
</w:document>"""

    zip_out.writestr('word/document.xml', document_xml)
    zip_out.close()

    docx_bytes = zip_buffer.getvalue()
    if docx_output:
        if isinstance(docx_output, (str, os.PathLike)):
            with open(docx_output, 'wb') as f:
                f.write(docx_bytes)
        elif hasattr(docx_output, 'write'):
            docx_output.write(docx_bytes)
    return docx_bytes

def convert_pdf_to_docx(pdf_input, docx_output=None):
    if isinstance(pdf_input, (str, bytes, bytearray, io.BytesIO)):
        if isinstance(pdf_input, (str, os.PathLike)):
            doc = fitz.open(pdf_input)
        elif isinstance(pdf_input, io.BytesIO):
            doc = fitz.open(stream=pdf_input.getvalue(), filetype="pdf")
        else:
            doc = fitz.open(stream=pdf_input, filetype="pdf")
    else:
        doc = pdf_input

    total_pages = len(doc)
    if total_pages == 0:
        raise ValueError("PDF document has 0 pages")

    is_complex_doc = any(is_page_complex(p) for p in doc)

    if is_complex_doc:
        return convert_complex_pdf_to_docx(doc, docx_output)
    else:
        return convert_flow_pdf_to_docx(doc, docx_output)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 pdf_to_docx_engine.py <input.pdf> [output.docx]")
        sys.exit(1)
    in_pdf = sys.argv[1]
    out_docx = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(in_pdf)[0] + ".docx"
    convert_pdf_to_docx(in_pdf, out_docx)
    print(f"✅ Đã chuyển đổi thành công: {out_docx}")
