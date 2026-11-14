// Danh mục đầy đủ 118 công cụ của ứng dụng PDFeve
export const CATEGORIES = [
  { id: 'all', name: 'Tất cả', count: 118 },
  { id: 'organize', name: 'Sắp xếp', count: 28 },
  { id: 'from_pdf', name: 'Từ PDF', count: 17 },
  { id: 'to_pdf', name: 'Sang PDF', count: 33 },
  { id: 'edit', name: 'Chỉnh sửa', count: 21 },
  { id: 'optimize', name: 'Tối ưu', count: 10 },
  { id: 'security', name: 'Bảo mật', count: 9 },
];

export const TOOLS_DATA = [
  // ==========================================
  // NHÓM 1: SẮP XẾP & QUẢN LÝ (28 CÔNG CỤ)
  // ==========================================
  {
    id: 'merge-pdf',
    name: 'Gộp PDF',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'layers',
    desc: 'Ghép nhiều tệp PDF thành một tài liệu duy nhất theo thứ tự mong muốn.',
    featured: true,
    actionType: 'merge'
  },
  {
    id: 'split-pdf',
    name: 'Chia PDF',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'scissors',
    desc: 'Tách một tệp PDF thành nhiều tệp nhỏ hoặc trích xuất theo khoảng trang.',
    featured: true,
    actionType: 'split'
  },
  {
    id: 'extract-pages',
    name: 'Trích xuất trang',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'grid',
    desc: 'Chọn và lưu các trang cụ thể thành một tệp PDF mới hoàn toàn.',
    featured: true,
    actionType: 'extract'
  },
  {
    id: 'delete-pages',
    name: 'Xóa trang',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'trash',
    desc: 'Loại bỏ các trang không cần thiết hoặc trang trắng khỏi tài liệu.',
    featured: true,
    actionType: 'delete'
  },
  {
    id: 'reorder-pages',
    name: 'Sắp xếp trang',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'move',
    desc: 'Kéo thả để thay đổi vị trí, đảo lộn thứ tự các trang trong PDF.',
    featured: true,
    actionType: 'reorder'
  },
  {
    id: 'rotate-pdf',
    name: 'Xoay PDF',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'rotate-cw',
    desc: 'Xoay tài liệu 90°, 180° hoặc 270° cho từng trang hoặc toàn bộ file.',
    featured: true,
    actionType: 'rotate'
  },
  {
    id: 'multi-tool-pdf',
    name: 'Công cụ đa năng PDF',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'layout',
    desc: 'Trình quản lý tổng hợp: vừa xem trang, xoay, xóa, đổi thứ tự trên một bảng vẽ trực quan.',
    featured: true,
    actionType: 'organizer'
  },
  {
    id: 'add-blank-page',
    name: 'Thêm trang trống',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'file-plus',
    desc: 'Chèn thêm trang trắng tinh vào đầu, giữa hoặc cuối tài liệu.',
    featured: true,
    actionType: 'add_blank'
  },
  {
    id: 'duplicate-pages',
    name: 'Nhân bản trang',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'copy',
    desc: 'Tạo bản sao giống hệt của một hoặc nhiều trang được chọn.',
    featured: false,
    actionType: 'duplicate'
  },
  {
    id: 'split-even-odd',
    name: 'Tách trang chẵn/lẻ',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'columns',
    desc: 'Phân chia tài liệu thành 2 tệp: một tập trang chẵn và một tập trang lẻ.',
    featured: false,
    actionType: 'split_even_odd'
  },
  {
    id: 'alternate-mix',
    name: 'Gộp so le',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'shuffle',
    desc: 'Ghép xen kẽ hai tệp PDF (mặt trước và mặt sau) thành một file hoàn chỉnh.',
    featured: false,
    actionType: 'alternate_mix'
  },
  {
    id: 'split-by-size',
    name: 'Chia theo dung lượng',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'hard-drive',
    desc: 'Tự động cắt nhỏ tài liệu để không vượt quá dung lượng tối đa (MB).',
    featured: false,
    actionType: 'split_size'
  },
  {
    id: 'split-by-bookmark',
    name: 'Chia theo mục lục',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'bookmark',
    desc: 'Cắt nhỏ tài liệu thành từng chương tương ứng theo Bookmark có sẵn.',
    featured: false,
    actionType: 'split_bookmark'
  },
  {
    id: 'reverse-pages',
    name: 'Đảo ngược thứ tự trang',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'arrow-down-up',
    desc: 'Lật ngược toàn bộ tài liệu từ trang cuối cùng lên trang đầu tiên.',
    featured: false,
    actionType: 'reverse'
  },
  {
    id: 'n-up-2',
    name: 'Ghép 2 trang vào 1',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'book-open',
    desc: 'Đặt 2 trang tài liệu nằm song song trên 1 mặt giấy A4.',
    featured: false,
    actionType: 'n_up_2'
  },
  {
    id: 'n-up-4',
    name: 'Ghép 4 trang vào 1',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'table',
    desc: 'Bố cục 4 trang thu nhỏ trên 1 mặt giấy để in tài liệu ôn tập tiết kiệm giấy.',
    featured: false,
    actionType: 'n_up_4'
  },
  {
    id: 'make-booklet',
    name: 'Tạo sách gập (Booklet)',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'book',
    desc: 'Tự động tính toán số trang để in gập đôi thành một cuốn sổ tay nhỏ.',
    featured: false,
    actionType: 'booklet'
  },
  {
    id: 'split-to-single-pages',
    name: 'Tách từng trang rời rạc',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'files',
    desc: 'Xuất mỗi trang của PDF thành một file PDF độc lập.',
    featured: false,
    actionType: 'split_single'
  },
  {
    id: 'equal-parts-split',
    name: 'Chia đều thành N phần',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'percent',
    desc: 'Chia đều tổng số trang thành các tập tài liệu có số trang bằng nhau.',
    featured: false,
    actionType: 'equal_split'
  },
  {
    id: 'insert-pdf',
    name: 'Chèn PDF vào giữa',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'plus-square',
    desc: 'Đưa một tệp PDF phụ vào sau vị trí trang cụ thể của tệp chính.',
    featured: false,
    actionType: 'insert_pdf'
  },
  {
    id: 'replace-pages',
    name: 'Thay thế trang',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'refresh-cw',
    desc: 'Thay thế một trang bất kỳ bằng trang mới từ tài liệu khác.',
    featured: false,
    actionType: 'replace_pages'
  },
  {
    id: 'split-spread',
    name: 'Cắt đôi trang đôi',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'split',
    desc: 'Tách các trang scan khổ lớn (2 trang liền) thành từng trang đơn.',
    featured: false,
    actionType: 'split_spread'
  },
  {
    id: 'auto-deskew',
    name: 'Nắn thẳng trang tự động',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'compass',
    desc: 'Tự động nhận diện và xoay thẳng các trang bị quét scan lệch góc.',
    featured: false,
    actionType: 'auto_deskew'
  },
  {
    id: 'remove-blank-pages',
    name: 'Tự động xóa trang trắng',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'file-x',
    desc: 'Quét và loại bỏ tất cả các trang không có nội dung phát sinh khi scan.',
    featured: false,
    actionType: 'remove_blanks'
  },
  {
    id: 'add-cover-page',
    name: 'Thêm trang bìa',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'award',
    desc: 'Tạo và chèn trang bìa thiết kế chuẩn vào đầu tài liệu.',
    featured: false,
    actionType: 'add_cover'
  },
  {
    id: 'outline-extractor',
    name: 'Trích xuất cây thư mục',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'list-tree',
    desc: 'Xem và xuất cấu trúc chỉ mục các chương hồi trong tài liệu.',
    featured: false,
    actionType: 'outline'
  },
  {
    id: 'standardize-page-size',
    name: 'Quy chuẩn khổ giấy',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'maximize-2',
    desc: 'Chuyển toàn bộ các trang về cùng kích thước chuẩn A4 hoặc Letter.',
    featured: false,
    actionType: 'standardize_size'
  },
  {
    id: 'compare-pdf',
    name: 'So sánh hai tệp PDF',
    category: 'organize',
    categoryName: 'SẮP XẾP & QUẢN LÝ',
    icon: 'git-diff',
    desc: 'Đặt 2 file cạnh nhau và làm nổi bật những điểm khác biệt giữa các phiên bản.',
    featured: false,
    actionType: 'compare'
  },

  // ==========================================
  // NHÓM 2: CHUYỂN ĐỔI TỪ PDF (17 CÔNG CỤ)
  // ==========================================
  {
    id: 'pdf-to-word',
    name: 'PDF sang Word',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'file-text',
    desc: 'Chuyển tài liệu PDF sang tệp Word (.docx) có thể chỉnh sửa tự do.',
    featured: true,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF sang JPG',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'image',
    desc: 'Trích xuất mỗi trang PDF thành một ảnh JPG chất lượng cao.',
    featured: true,
    actionType: 'pdf_to_images'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF sang Excel',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'sheet',
    desc: 'Bóc tách các bảng dữ liệu trong PDF thành bảng tính Excel (.xlsx).',
    featured: true,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-ocr',
    name: 'Nhận dạng chữ (OCR)',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'scan-text',
    desc: 'Bóc tách văn bản tiếng Việt từ tài liệu scan hoặc ảnh chụp sang văn bản có thể tìm kiếm.',
    featured: true,
    actionType: 'ocr'
  },
  {
    id: 'pdf-to-png',
    name: 'PDF sang PNG',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'file-image',
    desc: 'Chuyển đổi từng trang thành ảnh PNG sắc nét, hỗ trợ nền trong suốt.',
    featured: true,
    actionType: 'pdf_to_images'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF sang văn bản',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'type',
    desc: 'Trích xuất toàn bộ văn bản thuần túy (.txt) bên trong tệp PDF.',
    featured: true,
    actionType: 'extract_text'
  },
  {
    id: 'extract-images',
    name: 'Trích xuất ảnh',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'download',
    desc: 'Lọc và tải về toàn bộ các hình ảnh minh họa được nhúng trong tài liệu.',
    featured: true,
    actionType: 'extract_images'
  },
  {
    id: 'pdf-to-webp',
    name: 'PDF sang WebP',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'globe',
    desc: 'Chuyển các trang thành định dạng WebP siêu nhẹ, chuyên dùng cho website.',
    featured: true,
    actionType: 'pdf_to_images'
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF sang PowerPoint',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'presentation',
    desc: 'Chuyển mỗi trang PDF thành một slide thuyết trình (.pptx).',
    featured: false,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-html',
    name: 'PDF sang HTML',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'code',
    desc: 'Biến tài liệu PDF thành trang web tương thích mọi trình duyệt.',
    featured: false,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-csv',
    name: 'PDF sang CSV',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'file-spreadsheet',
    desc: 'Trích xuất dữ liệu số liệu dạng bảng cho kế toán và phân tích.',
    featured: false,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-rtf',
    name: 'PDF sang RTF',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'file-edit',
    desc: 'Chuyển đổi thành tệp văn bản giàu định dạng (Rich Text Format).',
    featured: false,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-svg',
    name: 'PDF sang SVG',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'vector',
    desc: 'Xuất các trang vector sắc nét vô hạn phục vụ thiết kế đồ họa.',
    featured: false,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-epub',
    name: 'PDF sang EPUB',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'tablet',
    desc: 'Định dạng sách điện tử tương thích với Kindle, Kobo, iPad.',
    featured: false,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-markdown',
    name: 'PDF sang Markdown',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'hash',
    desc: 'Xuất nội dung sang định dạng Markdown (.md) cho ghi chú kỹ thuật.',
    featured: false,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-json',
    name: 'PDF sang JSON',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'braces',
    desc: 'Bóc tách cấu trúc văn bản, bảng và tọa độ phần tử sang định dạng JSON.',
    featured: false,
    actionType: 'convert_export'
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF sang PDF/A',
    category: 'from_pdf',
    categoryName: 'CHUYỂN ĐỔI TỪ PDF',
    icon: 'archive',
    desc: 'Chuyển đổi sang chuẩn lưu trữ văn thư quốc tế dài hạn không bị lỗi font.',
    featured: false,
    actionType: 'convert_export'
  },

  // ==========================================
  // NHÓM 3: CHUYỂN ĐỔI SANG PDF (33 CÔNG CỤ)
  // ==========================================
  {
    id: 'jpg-to-pdf',
    name: 'JPG sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'image-plus',
    desc: 'Gộp nhiều ảnh JPG thành một tệp tài liệu PDF chuẩn A4.',
    featured: true,
    actionType: 'images_to_pdf'
  },
  {
    id: 'photos-to-pdf',
    name: 'Ảnh sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'images',
    desc: 'Chuyển đổi tập hợp hình ảnh nhiều định dạng khác nhau sang PDF.',
    featured: true,
    actionType: 'images_to_pdf'
  },
  {
    id: 'word-to-pdf',
    name: 'Word sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'file-text',
    desc: 'Chuyển đổi file Word (.doc, .docx) giữ nguyên 100% định dạng và căn lề.',
    featured: true,
    actionType: 'office_to_pdf'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'sheet',
    desc: 'Xuất bảng tính Excel (.xls, .xlsx) vừa vặn khổ in mà không bị tràn cột.',
    featured: true,
    actionType: 'office_to_pdf'
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'presentation',
    desc: 'Đóng gói slide bài giảng PowerPoint (.ppt, .pptx) sang PDF để in ấn.',
    featured: true,
    actionType: 'office_to_pdf'
  },
  {
    id: 'png-to-pdf',
    name: 'PNG sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'file-image',
    desc: 'Đóng gói ảnh PNG chất lượng cao thành tài liệu PDF.',
    featured: true,
    actionType: 'images_to_pdf'
  },
  {
    id: 'heic-to-pdf',
    name: 'HEIC sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'smartphone',
    desc: 'Chuyển đổi trực tiếp ảnh chụp từ iPhone/iPad (.heic) sang tài liệu PDF.',
    featured: true,
    actionType: 'images_to_pdf'
  },
  {
    id: 'text-to-pdf',
    name: 'Văn bản sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'align-left',
    desc: 'Tạo tài liệu PDF từ ghi chú hoặc văn bản thuần (.txt).',
    featured: true,
    actionType: 'text_to_pdf'
  },
  {
    id: 'html-to-pdf',
    name: 'HTML sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'code',
    desc: 'Biên dịch mã HTML và CSS thành tệp PDF hoàn chỉnh.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'markdown-to-pdf',
    name: 'Markdown sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'hash',
    desc: 'Biên tập tài liệu Markdown (.md) thành bản in PDF chuyên nghiệp.',
    featured: false,
    actionType: 'text_to_pdf'
  },
  {
    id: 'camera-to-pdf',
    name: 'Ảnh chụp Camera sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'camera',
    desc: 'Chụp trực tiếp giấy tờ bằng camera máy tính và đóng gói thành PDF.',
    featured: false,
    actionType: 'camera_to_pdf'
  },
  {
    id: 'scan-to-pdf',
    name: 'Quét từ máy scan',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'printer',
    desc: 'Kết nối máy quét TWAIN để nạp trực tiếp tài liệu vào PDF.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'url-to-pdf',
    name: 'URL trang web sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'link-2',
    desc: 'Nhập địa chỉ trang web để tải toàn trang thành tài liệu PDF.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'clipboard-to-pdf',
    name: 'Ảnh bộ nhớ tạm (Paste) sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'clipboard',
    desc: 'Dán trực tiếp ảnh chụp màn hình từ phím Ctrl+V để tạo file PDF.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'tiff-to-pdf',
    name: 'TIFF sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'file-digit',
    desc: 'Chuyển đổi tệp ảnh quét đa trang TIFF sang PDF.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'bmp-to-pdf',
    name: 'BMP sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'image',
    desc: 'Chuyển đổi ảnh đồ họa Bitmap Windows sang PDF.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'webp-to-pdf',
    name: 'WebP sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'globe',
    desc: 'Chuyển đổi hình ảnh định dạng WebP sang PDF.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'csv-to-pdf',
    name: 'CSV sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'file-spreadsheet',
    desc: 'Định dạng bảng số liệu CSV thành các trang báo cáo in ấn.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'rtf-to-pdf',
    name: 'RTF sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'file-edit',
    desc: 'Chuyển đổi văn bản định dạng phong phú RTF sang PDF.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'epub-to-pdf',
    name: 'EPUB sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'book',
    desc: 'Đổi tệp sách điện tử EPUB sang khổ giấy in PDF.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'code-to-pdf',
    name: 'Mã nguồn (Code) sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'terminal',
    desc: 'Tạo tài liệu PDF in mã nguồn với màu sắc cú pháp lập trình đẹp mắt.',
    featured: false,
    actionType: 'text_to_pdf'
  },
  {
    id: 'gif-to-pdf',
    name: 'Ảnh GIF sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'film',
    desc: 'Lưu các khung hình của ảnh động GIF vào tài liệu.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'svg-to-pdf',
    name: 'SVG sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'vector',
    desc: 'Đóng gói đồ họa vector SVG chất lượng cao không bị vỡ nét.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'email-to-pdf',
    name: 'Email (.eml) sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'mail',
    desc: 'Lưu trữ thư điện tử giao dịch kèm tập tin đính kèm sang PDF.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'odt-to-pdf',
    name: 'ODT sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'file-text',
    desc: 'Chuyển đổi văn bản nguồn mở OpenOffice/LibreOffice sang PDF.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'ods-to-pdf',
    name: 'ODS sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'sheet',
    desc: 'Chuyển đổi bảng tính OpenOffice sang PDF.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'odp-to-pdf',
    name: 'ODP sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'presentation',
    desc: 'Chuyển đổi bài trình chiếu OpenOffice sang PDF.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'xml-invoice-to-pdf',
    name: 'Hóa đơn điện tử XML sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'receipt',
    desc: 'Hiển thị và xuất hóa đơn điện tử theo mẫu chuẩn Tổng cục Thuế Việt Nam.',
    featured: false,
    actionType: 'office_to_pdf'
  },
  {
    id: 'psd-to-pdf',
    name: 'Photoshop PSD sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'palette',
    desc: 'Chuyển file thiết kế Photoshop sang tài liệu PDF xem nhanh.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'ai-to-pdf',
    name: 'Illustrator AI sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'pen-tool',
    desc: 'Chuyển đổi bản vẽ thiết kế Illustrator sang tài liệu PDF.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'zip-images-to-pdf',
    name: 'File nén ZIP ảnh sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'folder-archive',
    desc: 'Tự động giải nén và gộp hàng trăm ảnh trong tệp ZIP thành 1 file PDF.',
    featured: false,
    actionType: 'images_to_pdf'
  },
  {
    id: 'log-to-pdf',
    name: 'File nhật ký (Log) sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'file-code',
    desc: 'Lưu trữ các báo cáo hệ thống dạng văn bản sang PDF.',
    featured: false,
    actionType: 'text_to_pdf'
  },
  {
    id: 'vcf-to-pdf',
    name: 'Danh bạ (VCF) sang PDF',
    category: 'to_pdf',
    categoryName: 'CHUYỂN ĐỔI SANG PDF',
    icon: 'contact',
    desc: 'Xuất danh bạ điện thoại thành sổ danh bạ in ấn dạng bảng.',
    featured: false,
    actionType: 'office_to_pdf'
  },

  // ==========================================
  // NHÓM 4: CHỈNH SỬA & GHI CHÚ (21 CÔNG CỤ)
  // ==========================================
  {
    id: 'edit-pdf-text',
    name: 'Chỉnh sửa văn bản PDF',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'type',
    desc: 'Sửa lỗi chính tả, thay thế chữ và cập nhật số liệu trực tiếp trong trang PDF.',
    featured: true,
    actionType: 'editor'
  },
  {
    id: 'annotate-pdf',
    name: 'Chỉnh sửa & ghi chú',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'edit-3',
    desc: 'Bút dạ quang đánh dấu (highlight), gạch chân, viết ghi chú và vẽ tay.',
    featured: true,
    actionType: 'annotate'
  },
  {
    id: 'sign-pdf',
    name: 'Ký PDF',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'signature',
    desc: 'Ký bằng nét vẽ chuột, gõ tên hoặc chèn ảnh chữ ký/con dấu tròn vào tài liệu.',
    featured: true,
    actionType: 'sign'
  },
  {
    id: 'watermark-pdf',
    name: 'Đóng dấu mờ',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'stamp',
    desc: 'Đóng dấu bản quyền chìm (VÍ DỤ: "BẢO MẬT", "DỰ THẢO") chống sao chép tài liệu.',
    featured: true,
    actionType: 'watermark'
  },
  {
    id: 'page-numbers',
    name: 'Đánh số trang',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'list-ordered',
    desc: 'Tự động chèn số trang theo định dạng tuỳ chọn ở các góc hoặc đáy trang.',
    featured: true,
    actionType: 'page_numbers'
  },
  {
    id: 'header-footer',
    name: 'Đầu trang & Chân trang',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'panel-top',
    desc: 'Thêm tên cơ quan, tiêu đề dự án hoặc ngày tháng trên từng trang.',
    featured: true,
    actionType: 'header_footer'
  },
  {
    id: 'crop-pdf',
    name: 'Cắt lề PDF',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'crop',
    desc: 'Cắt bỏ phần lề trắng dư thừa để tối ưu không gian hiển thị hoặc in ấn.',
    featured: true,
    actionType: 'crop'
  },
  {
    id: 'fill-form',
    name: 'Điền biểu mẫu PDF',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'check-square',
    desc: 'Nhập thông tin vào các ô biểu mẫu tương tác, chọn ô đánh dấu kiểm.',
    featured: true,
    actionType: 'fill_form'
  },
  {
    id: 'create-form',
    name: 'Tạo form biểu mẫu mới',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'form-input',
    desc: 'Thêm các ô điền chữ, checkbox, radio button cho người khác nhập liệu.',
    featured: false,
    actionType: 'create_form'
  },
  {
    id: 'insert-image',
    name: 'Chèn ảnh vào PDF',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'image',
    desc: 'Thêm logo công ty, ảnh minh họa hoặc con dấu vào trang chỉ định.',
    featured: false,
    actionType: 'insert_image'
  },
  {
    id: 'insert-shapes',
    name: 'Chèn hình khối & mũi tên',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'square',
    desc: 'Vẽ khung chữ nhật, hình tròn, đường kẻ hoặc mũi tên chỉ dẫn.',
    featured: false,
    actionType: 'shapes'
  },
  {
    id: 'add-links',
    name: 'Thêm liên kết (Hyperlink)',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'link',
    desc: 'Tạo liên kết mở website ngoài hoặc nhảy đến trang khác trong tài liệu.',
    featured: false,
    actionType: 'links'
  },
  {
    id: 'edit-bookmarks',
    name: 'Tạo & Sửa mục lục (Bookmarks)',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'bookmark',
    desc: 'Tạo cây thư mục phân cấp chương mục cho sách hoặc tài liệu dài.',
    featured: false,
    actionType: 'bookmarks'
  },
  {
    id: 'measure-tool',
    name: 'Thước đo kích thước & diện tích',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'ruler',
    desc: 'Đo khoảng cách và diện tích trên bản vẽ kỹ thuật kiến trúc, xây dựng.',
    featured: false,
    actionType: 'measure'
  },
  {
    id: 'stamp-date',
    name: 'Đóng dấu ngày tháng',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'calendar',
    desc: 'Đóng dấu thời gian nhận tài liệu theo định dạng ngày giờ Việt Nam.',
    featured: false,
    actionType: 'stamp_date'
  },
  {
    id: 'status-stamps',
    name: 'Đóng dấu trạng thái (Đã duyệt)',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'check-circle-2',
    desc: 'Đóng các con dấu nghiệp vụ: ĐÃ DUYỆT, TỪ CHỐI, ĐÃ THANH TOÁN, BÍ MẬT.',
    featured: false,
    actionType: 'status_stamps'
  },
  {
    id: 'insert-qr-barcode',
    name: 'Chèn mã QR & Barcode',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'qr-code',
    desc: 'Tạo mã QR hoặc mã vạch định danh hồ sơ dán vào góc tài liệu.',
    featured: false,
    actionType: 'qr_barcode'
  },
  {
    id: 'whiteout-eraser',
    name: 'Tẩy trắng vùng chọn (Whiteout)',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'eraser',
    desc: 'Xóa vết mực lem hoặc che các vùng không mong muốn bằng màu trắng.',
    featured: false,
    actionType: 'whiteout'
  },
  {
    id: 'change-font-size',
    name: 'Thay đổi font và cỡ chữ',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'case-sensitive',
    desc: 'Điều chỉnh cỡ chữ và font cho các nội dung văn bản.',
    featured: false,
    actionType: 'editor'
  },
  {
    id: 'dark-mode-invert',
    name: 'Chế độ đọc ban đêm',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'moon',
    desc: 'Đảo ngược màu trang nền đen chữ trắng để đọc sách đêm không mỏi mắt.',
    featured: false,
    actionType: 'dark_mode'
  },
  {
    id: 'attachment-manager',
    name: 'Quản lý tệp đính kèm',
    category: 'edit',
    categoryName: 'CHỈNH SỬA & GHI CHÚ',
    icon: 'paperclip',
    desc: 'Nhúng hoặc trích xuất các tệp tin đính kèm ẩn bên trong file PDF.',
    featured: false,
    actionType: 'attachments'
  },

  // ==========================================
  // NHÓM 5: TỐI ƯU HÓA (10 CÔNG CỤ)
  // ==========================================
  {
    id: 'compress-pdf',
    name: 'Nén PDF',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'minimize-2',
    desc: 'Giảm 50-70% dung lượng tệp tin mà vẫn giữ được chất lượng hiển thị rõ nét.',
    featured: true,
    actionType: 'compress'
  },
  {
    id: 'extreme-compress',
    name: 'Nén PDF cực đại',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'package',
    desc: 'Nén tối đa dung lượng để đính kèm email hoặc tải lên cổng dịch vụ công.',
    featured: true,
    actionType: 'compress'
  },
  {
    id: 'repair-pdf',
    name: 'Sửa lỗi PDF',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'wrench',
    desc: 'Khôi phục và sửa các tệp PDF bị lỗi cấu trúc không mở được.',
    featured: true,
    actionType: 'repair'
  },
  {
    id: 'flatten-pdf',
    name: 'Làm phẳng PDF (Flatten)',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'layers',
    desc: 'Hợp nhất toàn bộ các lớp form, chữ ký thành trang phẳng cố định chống chỉnh sửa.',
    featured: true,
    actionType: 'flatten'
  },
  {
    id: 'linearize-pdf',
    name: 'Tối ưu hiển thị Web',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'zap',
    desc: 'Chuyển đổi sang chuẩn Fast Web View giúp tài liệu hàng trăm trang mở tức thì trên mạng.',
    featured: true,
    actionType: 'optimize'
  },
  {
    id: 'remove-metadata',
    name: 'Xóa siêu dữ liệu ẩn',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'shield-alert',
    desc: 'Xóa tên tác giả, phần mềm tạo, lịch sử chỉnh sửa để bảo mật thông tin.',
    featured: true,
    actionType: 'remove_meta'
  },
  {
    id: 'font-subset',
    name: 'Tối ưu phông chữ nhúng',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'type',
    desc: 'Lược bỏ các ký tự phông chữ không sử dụng để giảm kích thước tài liệu.',
    featured: true,
    actionType: 'optimize'
  },
  {
    id: 'downsample-images',
    name: 'Giảm độ phân giải ảnh',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'image-minus',
    desc: 'Hạ độ phân giải ảnh nội bộ về 150 DPI hoặc 72 DPI để giảm dung lượng lớn.',
    featured: true,
    actionType: 'compress'
  },
  {
    id: 'grayscale-pdf',
    name: 'Chuyển sang đen trắng',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'circle-dot',
    desc: 'Biến toàn bộ tài liệu có màu sang đen trắng giúp tiết kiệm mực in.',
    featured: false,
    actionType: 'grayscale'
  },
  {
    id: 'clean-scans',
    name: 'Làm sạch trang scan',
    category: 'optimize',
    categoryName: 'TỐI ƯU HÓA',
    icon: 'sparkles',
    desc: 'Tự động tẩy sạch các vết nhiễu bụi bẩn và tăng độ tương phản trang scan.',
    featured: false,
    actionType: 'clean_scan'
  },

  // ==========================================
  // NHÓM 6: BẢO MẬT & CHỨNG THỰC (9 CÔNG CỤ)
  // ==========================================
  {
    id: 'encrypt-pdf',
    name: 'Đặt mật khẩu PDF',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'lock',
    desc: 'Mã hóa tài liệu bằng thuật toán AES bảo mật cao, yêu cầu mật khẩu để mở.',
    featured: true,
    actionType: 'encrypt'
  },
  {
    id: 'decrypt-pdf',
    name: 'Mở khóa PDF',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'unlock',
    desc: 'Gỡ bỏ mật khẩu mở file hoặc hạn chế in ấn khi bạn đã biết mật khẩu.',
    featured: true,
    actionType: 'decrypt'
  },
  {
    id: 'permissions-control',
    name: 'Phân quyền in & sao chép',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'shield-check',
    desc: 'Khóa không cho phép in ấn, chống sao chép văn bản hoặc cấm trích xuất trang.',
    featured: true,
    actionType: 'permissions'
  },
  {
    id: 'redact-sensitive',
    name: 'Xóa vĩnh viễn dữ liệu nhạy cảm',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'eye-off',
    desc: 'Bôi đen và tiêu hủy vĩnh viễn thông tin cá nhân (CCCD, tài khoản) không thể khôi phục.',
    featured: true,
    actionType: 'redact'
  },
  {
    id: 'digital-signature',
    name: 'Ký số điện tử (USB Token)',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'badge-check',
    desc: 'Ký số pháp lý bằng chứng thư số chuẩn doanh nghiệp Việt Nam.',
    featured: true,
    actionType: 'digital_sign'
  },
  {
    id: 'validate-signature',
    name: 'Xác thực chữ ký số',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'shield-alert',
    desc: 'Kiểm tra tính nguyên vẹn của văn bản sau khi ký có bị sửa đổi hay không.',
    featured: true,
    actionType: 'validate_sign'
  },
  {
    id: 'anti-copy-pdf',
    name: 'Chống sao chép nội dung',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'ban',
    desc: 'Biến text thành vector/hình ảnh để ngăn chặn hoàn toàn việc bôi đen copy.',
    featured: true,
    actionType: 'anti_copy'
  },
  {
    id: 'expire-pdf',
    name: 'Đặt hạn tự hủy tài liệu',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'timer',
    desc: 'Quy định ngày hết hạn mở tệp tin cho các tài liệu nội bộ bảo mật.',
    featured: true,
    actionType: 'expire'
  },
  {
    id: 'pdf-security-scan',
    name: 'Quét an toàn & mã độc',
    category: 'security',
    categoryName: 'BẢO MẬT & QUYỀN HẠN',
    icon: 'scan-eye',
    desc: 'Rà soát các script JavaScript độc hại hoặc link lừa đảo ẩn trong tài liệu PDF.',
    featured: false,
    actionType: 'scan_security'
  }
];
