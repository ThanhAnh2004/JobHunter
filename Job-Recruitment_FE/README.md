# 💼 JobHunter Frontend - Premium IT Recruitment Platform

Chào mừng bạn đến với **JobHunter Client**, giao diện người dùng cao cấp của nền tảng tuyển dụng công nghệ. Dự án được thiết kế tỉ mỉ nhằm tối ưu hóa trải nghiệm tìm kiếm việc làm của ứng viên, đồng thời cung cấp bộ công cụ quản lý tuyển dụng trực quan, thông minh và hiện đại cho doanh nghiệp (HR/Admin).

---

## 🎯 Đối Tượng Sử Dụng & Lợi Ích (Target Audiences)

Hệ thống được thiết kế hướng tới 3 nhóm đối tượng chính với các chức năng chuyên biệt:

### 1. Dành Cho Ứng Viên (Candidates) - Tìm Việc Nhanh Chóng & Trực Quan
*   **Giao diện Kính mờ (Glassmorphism):** Trải nghiệm thị giác cao cấp với tông màu tối hiện đại (Dark Slate) và các hiệu ứng làm mờ kính tinh tế, giúp ứng viên tập trung vào nội dung công việc.
*   **Tìm kiếm & Bộ lọc thông minh:** Dễ dàng tìm kiếm cơ hội việc làm theo kỹ năng chuyên môn (Java, React, Node.js...), mức lương mong muốn và địa điểm làm việc.
*   **Nộp CV & Theo dõi trực quan:** Tải lên tệp CV nhanh chóng. Trạng thái hồ sơ của ứng viên (PENDING, REVIEWING, APPROVED, REJECTED) được hiển thị trực tiếp và minh bạch.
*   **Hộp thư thông báo thời gian thực (WebSockets):** Nhận thông báo tức thì ngay trên Header khi HR cập nhật trạng thái CV hoặc xếp lịch phỏng vấn, không cần tải lại trang.
*   **Bản tin việc làm:** Đăng ký nhận email gợi ý các vị trí tuyển dụng mới nhất phù hợp với kỹ năng cá nhân định kỳ.

### 2. Dành Cho Nhà Tuyển Dụng (HR / Recruiters) - Tối Ưu Quy Trình Tuyển Dụng
*   **Bảng quản lý CV Kanban trực quan:** HR có thể kéo thả hồ sơ của ứng viên qua các giai đoạn tuyển dụng (*Chờ xử lý* ➡️ *Đang đánh giá* ➡️ *Đạt yêu cầu* / *Từ chối*) thay vì quản lý bằng các bảng dữ liệu thủ công.
*   **Quản lý Công việc & Phỏng vấn:** Tạo tin tuyển dụng mới kèm yêu cầu kỹ năng chi tiết. Lên lịch phỏng vấn với ứng viên, thông báo tự động sẽ được gửi đi thông qua Email và WebSocket.
*   **AI Job Matching (Đánh giá CV thông minh):** Trong giao diện chi tiết hồ sơ ứng viên, HR chỉ cần click nút đánh giá AI. Hệ thống sẽ hiển thị vòng tròn tiến trình trực quan biểu thị phần trăm độ tương thích giữa CV của ứng viên (đã được trích xuất chữ) so với mô tả công việc, kèm theo nhận xét chi tiết của AI giúp HR ra quyết định nhanh chóng.
*   **Bảo mật dữ liệu Công ty:** HR của công ty nào chỉ thấy và quản lý được ứng viên, tin tuyển dụng và thống kê Dashboard của công ty đó.

### 3. Dành Cho Lập Trình Viên & Thầy Cô Đánh Giá (Technical Reviewers)
*   **Cấu trúc mã nguồn chuẩn mực:** Tổ chức mã nguồn dạng Modular Clean Code, phân tách rõ ràng giữa các phần: Components, Pages, Redux state, Configuration và Styles.
*   **TypeScript an toàn (Type-safe):** Định nghĩa interface chặt chẽ cho toàn bộ cấu trúc dữ liệu gửi và nhận từ Backend API, hạn chế tối đa lỗi runtime.
*   **Bảo vệ tuyến đường (Protected Routes):** Tích hợp Route Guard kết hợp Redux State để chặn truy cập trái phép. Người dùng thường (USER role) hoàn toàn không thể xem hoặc truy cập vào giao diện quản trị của Admin/HR.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

*   **Thư viện Core:** React JS (v18.2) & TypeScript (v5.3).
*   **Công cụ build:** Vite (Tốc độ khởi động server dev cực nhanh, tối ưu hóa bundle khi deploy production).
*   **Quản lý State:** Redux Toolkit (Quản lý trạng thái đăng nhập, phân quyền người dùng và thông tin cá nhân toàn cục).
*   **Thành phần giao diện (UI Components):** Ant Design (v5.13) & `@ant-design/pro-components` (Cung cấp các component bảng dữ liệu, form nhập liệu chuyên dụng cho quản trị).
*   **Kiểu dáng & Style:** Sass (Sử dụng SCSS Modules giúp cô lập CSS của từng component, tránh xung đột CSS toàn cục).
*   **Kết nối WebSockets:** `@stomp/stompjs` & `sockjs-client` (Tích hợp polyfill đối tượng `global` trong `index.html` để tương thích hoàn toàn với môi trường Vite).
*   **HTTP Client:** Axios (Cấu hình Interceptor tự động đính kèm Bearer Token vào header của mọi request, xử lý tự động cơ chế gọi API làm mới Access Token từ Refresh Token được lưu trong HttpOnly Cookie khi hết hạn).

---

## 📂 Cấu Trúc Thư Mục Dự Án (React Structure)

```text
src/
  ├── components/
  │     ├── admin/          # Giao diện quản trị (Modal xem chi tiết CV, Kanban Board, Quản lý Lịch phỏng vấn)
  │     ├── client/         # Giao diện phía ứng viên (Header, Footer, Bell thông báo thời gian thực)
  │     └── share/          # Các component dùng chung (Màn hình Loading, Access Control bảo vệ Route)
  ├── config/
  │     ├── api.ts          # Nơi định nghĩa toàn bộ API Endpoint gọi lên Backend (bao gồm cả API AI Match CV)
  │     └── axios-customize.ts  # Cấu hình Axios Interceptor xử lý JWT & Refresh Token tự động
  ├── pages/
  │     ├── admin/          # Các trang dành cho quản trị viên/HR (Dashboard, Quản lý Job, Quản lý Resume)
  │     ├── auth/           # Giao diện đăng nhập, đăng ký tài khoản
  │     └── home/           # Trang chủ tìm kiếm việc làm cho ứng viên
  ├── redux/                # Cấu hình Redux store và slices quản lý trạng thái phiên đăng nhập
  ├── styles/               # Chứa các file định nghĩa biến SCSS, layout và theme Dark Slate
  ├── App.tsx               # Cấu hình Router (Tuyến đường) ứng dụng và Route Guard
  └── main.tsx              # File entry khởi chạy ứng dụng React
```

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

### Yêu cầu hệ thống:
*   Máy tính đã cài đặt môi trường chạy **Node.js** (Khuyến nghị phiên bản **v18.x** hoặc **v20.x** để có hiệu năng tốt nhất).

### Các bước khởi chạy:

#### 1. Cài đặt các thư viện phụ thuộc:
Mở Terminal tại thư mục của dự án Frontend và thực hiện cài đặt:
```bash
npm install
```

#### 2. Cấu hình biến môi trường kết nối Backend:
Tạo một tệp `.env.development` nằm tại thư mục gốc của frontend (nếu chưa có) và điền cấu hình sau:
```env
VITE_BACKEND_URL=http://localhost:8080
VITE_ACL_ENABLE=true
```
*(Trong đó `VITE_BACKEND_URL` là địa chỉ chạy ứng dụng Spring Boot Backend của bạn).*

#### 3. Chạy ứng dụng ở chế độ Phát triển (Development):
```bash
npm run dev
```
Sau khi khởi chạy thành công, truy cập trình duyệt theo địa chỉ: `http://localhost:3000`

#### 4. Biên dịch đóng gói dự án (Production):
Khi cần deploy sản phẩm thực tế, chạy lệnh build để Vite tối ưu hóa và xuất mã nguồn ra thư mục `dist`:
```bash
npm run build
npm run preview
```