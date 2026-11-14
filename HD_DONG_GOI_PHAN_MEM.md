# 📦 HƯỚNG DẪN ĐÓNG GÓI CÀI ĐẶT & KẾT NỐI ĐIỆN THOẠI QUA MÃ QR (PDFEVE)

Phần mềm **PDFeve** đã được tích hợp đầy đủ công nghệ **Electron + Local Background Server** để có thể đóng gói thành file cài đặt độc lập trên cả **Windows** (`.exe`) và **macOS** (`.dmg`, `.zip`).

---

## 📱 1. VỀ TÍNH NĂNG QUÉT MÃ QR TRÊN ĐIỆN THOẠI SAU KHI CÀI ĐẶT

> **CÂU TRẢ LỜI LÀ: CÓ 100%! TÍNH NĂNG QUÉT MÃ QR VẪN HOẠT ĐỘNG HOÀN HẢO!**

### ⚙️ Cơ chế hoạt động thông minh:
1. **Tự khởi chạy Server ngầm**: Ngay khi bạn mở phần mềm PDFeve trên máy tính (Windows hoặc MacBook), phần mềm sẽ tự động bật một máy chủ web cục bộ siêu nhẹ chạy ngầm trên cổng `4567`.
2. **Nhận diện IP LAN thời gian thực**: Phần mềm tự động dò tìm địa chỉ IP mạng Wi-Fi của máy tính (ví dụ `http://192.168.1.15:4567`).
3. **Mã QR Offline 100%**: Mã QR được sinh trực tiếp bằng thuật toán vector cục bộ (không cần kết nối Internet máy tính vẫn hiển thị mã QR sắc nét).
4. **Cách dùng trên điện thoại**:
   - Điện thoại và máy tính kết nối vào **cùng 1 mạng Wi-Fi** (hoặc điện thoại bật *Điểm phát sóng di động/Hotspot* rồi cho máy tính kết nối vào).
   - Trên phần mềm máy tính, bấm vào biểu tượng **"Mở trên Điện thoại"** (hoặc nút Quét mã QR).
   - Dùng Camera điện thoại (iPhone) hoặc Zalo / Google Lens / Trình quét mã (Android) quét mã QR ➔ Điện thoại sẽ tự mở ngay giao diện webapp PDFeve đầy đủ 118 công cụ.
   - Có thể chọn file PDF trực tiếp từ bộ nhớ điện thoại để xử lý và tải kết quả về máy.

---

## 🛠️ 2. HƯỚNG DẪN ĐÓNG GÓI CHO MACBOOK & WINDOWS

Mở Terminal tại thư mục dự án `pdf` (`cd /Users/mac/Downloads/Antigravity/pdf`):

### A. Đóng gói cho MacBook (macOS):
```bash
# Xuất bộ cài đặt .dmg và .zip (Hỗ trợ cả Apple Silicon M1/M2/M3/M4 và Intel)
npm run build:mac
```
👉 **File thành phẩm nằm trong thư mục `dist/`**:
- `PDFeve-1.0.0.dmg`: File cài đặt chuẩn kéo vào thư mục `Applications`.
- `PDFeve-1.0.0-arm64-mac.zip` / `PDFeve-1.0.0-mac.zip`: File zip giải nén chạy trực tiếp không cần cài.

---

### B. Đóng gói cho máy tính Windows:
```bash
# Xuất bộ cài đặt Setup (.exe) và bản chạy ngay Portable (.exe)
npm run build:win
```
👉 **File thành phẩm nằm trong thư mục `dist/`**:
- `PDFeve Setup 1.0.0.exe`: File cài đặt tự động tạo icon ra màn hình Desktop và Start Menu cho người dùng.
- `PDFeve 1.0.0.exe` (Portable): Bản chạy độc lập trực tiếp từ USB, không cần quyền Quản trị viên (Admin), cắm vào bất kỳ máy tính Windows nào cũng chạy được ngay.

---

### C. Xuất đồng thời cho cả Windows & macOS cùng lúc:
```bash
npm run build:all
```

---

## 🚀 3. BẢN CHẠY THỬ NGHIỆM TỨC THÌ (KHÔNG CẦN CHỜ ĐÓNG GÓI)

Nếu muốn khởi chạy thử ngay trên máy hiện tại để kiểm tra giao diện và tính năng quét mã QR:
```bash
npm start
```
Cửa sổ phần mềm sẽ xuất hiện ngay, đồng thời cổng `4567` sẽ mở để bạn có thể cầm điện thoại quét mã thử nghiệm ngay lập tức!
