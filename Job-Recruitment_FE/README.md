# 💼 JobHunter Frontend - Premium IT Recruitment Platform

Chào mừng bạn đến với **JobHunter Client**, giao diện người dùng cao cấp của nền tảng tuyển dụng công nghệ. Dự án được thiết kế tỉ mỉ nhằm tối ưu hóa trải nghiệm tìm kiếm việc làm của ứng viên, đồng thời cung cấp bộ công cụ quản lý tuyển dụng trực quan, thông minh và hiện đại cho doanh nghiệp (HR/Admin).

---

## 🎯 Đối Tượng Sử Dụng & Lợi Ích (Target Audiences)

Hệ thống được thiết kế hướng tới 3 nhóm đối tượng chính với các chức năng chuyên biệt:

### 1. Dành Cho Ứng Viên (Candidates) - Tìm Việc Nhanh Chóng & Trực Quan
*   **Giao diện Kính mờ (Glassmorphism):** Trải nghiệm thị giác cao cấp với tông màu tối hiện đại (Dark Slate) và các hiệu ứng làm mờ kính tinh tế, giúp ứng viên tập trung vào nội dung công việc.
*   **Tìm kiếm & Bộ lọc thông minh:** Dễ dàng tìm kiếm cơ hội việc làm theo kỹ năng chuyên môn (Java, React, Node.js...), mức lương mong muốn và địa điểm làm việc.
*   **Nộp CV & Theo dõi trực quan:** Tải lên tệp CV nhanh chóng. Trạng thái hồ sơ của ứng viên (`PENDING`, `REVIEWING`, `APPROVED`, `REJECTED`) được hiển thị trực tiếp và minh bạch.
*   **Hộp thư thông báo thời gian thực (WebSockets):** Nhận thông báo tức thì ngay trên Header khi HR cập nhật trạng thái CV hoặc xếp lịch phỏng vấn, không cần tải lại trang.
*   **Nhắn tin trực tiếp với HR (Live Chat):** Trao đổi trực tiếp 1-1 với nhà tuyển dụng qua giao diện chat thời gian thực (`/chat`).
*   **Bộ Tiện Ích Phát Triển Sự Nghiệp (Career Toolkit 4 trong 1):**
    *   🧮 **Tính Lương GROSS - NET:** Quy đổi lương chuẩn theo luật bảo hiểm và thuế TNCN 2026.
    *   🧭 **Lộ Trình Nghề Nghiệp IT 2026:** Bản đồ kỹ năng từ Fresher lên Tech Lead/Architect cho Backend, Frontend, DevOps, AI & Mobile.
    *   📊 **Báo Cáo Lương IT 2026:** Khảo sát chi tiết dải lương theo từng tech stack và năm kinh nghiệm.
    *   🎯 **Bí Quyết Phỏng Vấn IT:** Hướng dẫn vượt qua vòng Technical & trả lời tình huống theo mô hình STAR.

### 2. Dành Cho Nhà Tuyển Dụng (HR / Recruiters - `/hr`) - Tối Ưu Quy Trình Tuyển Dụng
*   **Bảng quản lý CV Kanban trực quan:** HR có thể kéo thả hồ sơ của ứng viên qua các giai đoạn tuyển dụng (*Chờ xử lý* ➡️ *Đang đánh giá* ➡️ *Đạt yêu cầu* / *Từ chối*).
*   **AI Job Matching (Đánh giá CV thông minh):** Chấm điểm độ tương thích giữa CV và JD bằng Google Gemini AI kèm nhận xét chi tiết điểm mạnh/điểm yếu.
*   **Quản lý Tuyển dụng & Lịch phỏng vấn:** Tạo tin tuyển dụng, xếp lịch phỏng vấn tự động gửi email và thông báo đẩy cho ứng viên.
*   **Kênh Chat Tuyển Dụng (`/hr/chat`):** Trao đổi tức thời với các ứng viên nộp hồ sơ.
*   **Bảo mật dữ liệu Công ty:** HR của công ty nào chỉ thấy và quản lý được dữ liệu của công ty đó.

### 3. Dành Cho Quản Trị Viên (Super Admin - `/admin`) & Technical Reviewers
*   **Quản trị toàn diện:** Quản lý Người dùng, Phân quyền động (Roles & Permissions), Công ty, Việc làm, Kỹ năng và Thống kê tổng quan.
*   **Cấu hình Website Động (Site Settings):** Quản lý tên trang, logo, banner và thông tin liên hệ linh hoạt từ trang quản trị.
*   **Cấu trúc mã nguồn chuẩn mực:** Tổ chức mã nguồn dạng Modular Clean Code, phân tách rõ ràng giữa các phần: Components, Pages, Redux state, Configuration và Styles.
*   **TypeScript an toàn (Type-safe):** Định nghĩa interface chặt chẽ cho toàn bộ cấu trúc dữ liệu, hạn chế tối đa lỗi runtime.
*   **Bảo vệ tuyến đường (Protected Routes):** Tích hợp Route Guard kết hợp Redux State để chặn truy cập trái phép.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

*   **Thư viện Core:** React JS (v18.2) & TypeScript (v5.3).
*   **Công cụ build:** Vite (Khởi động cực nhanh, tối ưu hóa bundle).
*   **Quản lý State:** Redux Toolkit (Quản lý phiên đăng nhập, thông tin người dùng và quyền truy cập toàn cục).
*   **Thành phần giao diện (UI Components):** Ant Design (v5.13) & `@ant-design/pro-components`.
*   **Kiểu dáng & Style:** Sass / SCSS Modules (Cô lập CSS, tránh xung đột style toàn cục).
*   **Kết nối WebSockets:** `@stomp/stompjs` & `sockjs-client` (Hỗ trợ thông báo đẩy và Chat trực tuyến).
*   **HTTP Client:** Axios (Interceptor tự động đính kèm Token và xoay vòng Refresh Token qua HttpOnly Cookie).

---

## 📂 Cấu Trúc Thư Mục Dự Án (React Structure)

```text
src/
  ├── components/
  │     ├── admin/          # Giao diện quản trị (Modal CV, Kanban Board, Lịch phỏng vấn, Quản lý cấu hình)
  │     ├── client/         # Giao diện ứng viên (Header, Footer, Bell thông báo, Chat icon, Career Toolkit)
  │     │     └── home/     # Các thành phần trang chủ (Career Toolkit, Lộ trình IT, Tính lương Gross-Net, ...)
  │     └── share/          # Các component dùng chung (Loading spinner, Protected Route Guard)
  ├── config/
  │     ├── api.ts          # Định nghĩa toàn bộ REST API Endpoints gọi lên Backend
  │     └── axios-customize.ts  # Axios Interceptors xử lý JWT & Refresh Token tự động
  ├── pages/
  │     ├── admin/          # Các trang quản trị hệ thống (/admin)
  │     ├── hr/             # Cổng thông tin dành riêng cho Nhà tuyển dụng (/hr)
  │     ├── chat/           # Giao diện nhắn tin thời gian thực (/chat)
  │     ├── auth/           # Đăng nhập, Đăng ký
  │     └── home/           # Trang chủ tìm kiếm việc làm
  ├── redux/                # Cấu hình Redux store và user account slice
  ├── styles/               # Biến SCSS, layout và theme Dark Slate
  ├── App.tsx               # Cấu hình React Router và Route Guard
  └── main.tsx              # Entry point ứng dụng
```

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

### Yêu cầu hệ thống:
*   Máy tính đã cài đặt **Node.js** (Khuyến nghị phiên bản **v18.x** hoặc **v20.x**).

### Các bước khởi chạy:

#### 1. Cài đặt dependencies:
```bash
npm install
```

#### 2. Cấu hình biến môi trường:
Tạo file `.env.development` tại thư mục gốc của frontend:
```env
VITE_BACKEND_URL=http://localhost:8080
VITE_ACL_ENABLE=true
```

#### 3. Chạy ở chế độ Phát triển (Development):
```bash
npm run dev
```
Truy cập trình duyệt theo địa chỉ: `http://localhost:3000`

#### 4. Biên dịch đóng gói (Production Build):
```bash
npm run build
npm run preview
```