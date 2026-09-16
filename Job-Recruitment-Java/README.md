# ⚙️ JobHunter Backend - Advanced RESTful API & Real-time Server

Đây là hạt nhân xử lý nghiệp vụ (Backend RESTful API) của nền tảng tuyển dụng **JobHunter**. Được thiết kế và xây dựng theo kiến trúc phân lớp chuẩn Enterprise, kết hợp các công nghệ hiện đại như **Java 21 LTS** và **Spring Boot 4.x**, hệ thống mang lại hiệu năng cao, khả năng cô lập dữ liệu doanh nghiệp thông minh, phân quyền động linh hoạt, giao tiếp thời gian thực qua WebSockets và khả năng tự động trích xuất, đánh giá CV ứng viên bằng Trí tuệ nhân tạo (AI - Google Gemini).

Dự án này được thiết kế tối ưu để làm sản phẩm tiêu biểu trong Portfolio tuyển dụng, thể hiện kỹ năng lập trình hướng đối tượng, tư duy thiết kế hệ thống bảo mật cao và tích hợp dịch vụ bên thứ ba.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack & Libraries)

Hệ thống tận dụng tối đa sức mạnh của hệ sinh thái Java/Spring và các công cụ bổ trợ hiện đại:
*   **Core Platform:** Java 21 LTS (sử dụng Record, Pattern Matching, Stream API tối ưu) & Spring Boot 4.0.5.
*   **Security Framework:** Spring Security & Spring OAuth2 Resource Server.
*   **Authentication & Authorization:** JSON Web Token (JWT) với cơ chế Token kép (Access & Refresh Token).
*   **Persistence Layer:** Spring Data JPA & Hibernate Core 7.x (Tối ưu hóa câu lệnh SQL, quản lý Transaction).
*   **Database Engine:** MySQL Server (Hỗ trợ Unicode toàn diện `utf8mb4`).
*   **Real-time Communication:** Spring WebSocket & Spring Messaging (Giao thức STOMP).
*   **AI CV Parsing Pipe:** 
    *   **Apache Tika:** Thư viện trích xuất siêu dữ liệu và nội dung văn bản từ các tệp nhị phân phức tạp (PDF, Word `.docx`).
    *   **Google Gemini API (`gemini-1.5-flash`):** Mô hình AI ngôn ngữ lớn tối ưu tốc độ phân tích và phản hồi JSON cấu trúc.
*   **Email Engine:** Spring Starter Mail & Thymeleaf Template Engine (tự động render email HTML động gửi lịch hẹn, việc làm gợi ý).
*   **API Documentation:** Springdoc OpenAPI (Swagger UI).
*   **Utilities & Helpers:** Lombok, Jackson (JSON Serialization), com.turkraft.springfilter (Bộ lọc truy vấn JPA động từ client).

---

## 🏗️ Kiến Trúc Hệ Thống & Thiết Kế Phần Mềm (Architectural Design)

Hệ thống tuân thủ nghiêm ngặt **Kiến trúc phân lớp (Layered Architecture)** kết hợp các mẫu thiết kế (Design Patterns) phổ biến giúp tăng tính module và cô lập nghiệp vụ:

```text
[ Client (Vite + React) ] 
       │  ▲
       ▼  │ (HTTP requests / STOMP WebSockets)
┌────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                    │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 1. Security & Filter Layer                       │  │
│  │   - CorsFilter, JWTFilter, PermissionInterceptor │  │
│  └───────────────────┬──────────────────────────────┘  │
│                      │                                 │
│                      ▼                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 2. Controller Layer (REST Controllers)           │  │
│  │   - Validation (@Valid), DTO Mapping, Response   │  │
│  └───────────────────┬──────────────────────────────┘  │
│                      │                                 │
│                      ▼                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 3. Service Layer (Business Logic)                │  │
│  │   - @Transactional boundaries, Gemini AI, Tika   │  │
│  └───────────────────┬──────────────────────────────┘  │
│                      │                                 │
│                      ▼                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 4. Data Access Layer (JPA Repositories)          │  │
│  │   - Spring Data JPA, Hibernate, Specifications   │  │
│  └───────────────────┬──────────────────────────────┘  │
└──────────────────────┼─────────────────────────────────┘
                       │
                       ▼
            [ MySQL Database Engine ]
```

### Các Design Pattern & Kỹ thuật lập trình áp dụng:
1.  **Data Transfer Object (DTO) Pattern:** Tách biệt hoàn toàn tầng dữ liệu Database (`domain` entities) khỏi dữ liệu truyền tải trên mạng. Mọi Request và Response đều được định nghĩa thông qua các DTO cụ thể nhằm che giấu thông tin nhạy cảm (như mật khẩu, refresh token) và tránh lỗi tuần tự hóa đệ quy.
2.  **Repository Pattern:** Che giấu chi tiết tương tác với nguồn dữ liệu thông qua Spring Data JPA, giảm thiểu mã SQL thuần và tăng khả năng thay đổi hệ quản trị cơ sở dữ liệu sau này.
3.  **Interceptor Pattern:** Áp dụng `PermissionInterceptor` chặn các request trước khi vào Controller để thực hiện xác thực và phân quyền động.
4.  **Global Exception Handling:** Sử dụng `@ControllerAdvice` bắt toàn bộ ngoại lệ phát sinh trong hệ thống (như `IdInvalidException`, `PermissionException`, `MethodArgumentNotValidException`) để chuyển đổi thành cấu trúc JSON thông báo lỗi chuẩn hóa và dễ đọc đối với Frontend.

---

## 🌟 Các Tính Năng Core Nổi Bật (Project Highlights)

### 1. Phân Quyền Động Mức Endpoint (Database-driven Dynamic RBAC)
*   **Vấn đề của hệ thống thông thường:** Phân quyền cứng bằng code (ví dụ `@PreAuthorize("hasRole('ADMIN')")`) rất khó thay đổi khi dự án mở rộng mà không sửa và deploy lại code.
*   **Giải pháp của dự án:** Quản lý phân quyền động hoàn toàn thông qua cơ sở dữ liệu.
    *   Mỗi quyền (`Permission`) lưu trữ thông tin API Route cụ thể (`apiPath` như `/api/v1/users/**` và `method` như `POST`, `GET`, `DELETE`).
    *   Lớp **`PermissionInterceptor`** chặn mọi request đi vào hệ thống, lấy ra Route khớp nhất (`HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE`) và kiểm tra xem vai trò (`Role`) của người dùng hiện tại có chứa quyền truy cập vào Route đó với Method tương ứng hay không.
*   **Cô lập dữ liệu doanh nghiệp (Multi-tenancy Isolation):** Nhân sự (HR) thuộc công ty A chỉ có quyền xem các CV ứng tuyển, tạo lịch phỏng vấn và quản lý công việc thuộc phạm vi của công ty A. Hệ thống tự động trích xuất thông tin định danh công ty từ tài khoản HR hiện tại để ghi đè hoặc filter câu truy vấn SQL trước khi gửi xuống database.

### 2. Bảo Mật Token Kép Chống Tấn Công XSS & CSRF
*   **Access Token (JWT):** Có thời gian sống ngắn (ví dụ: vài phút hoặc vài giờ), được lưu trong bộ nhớ tạm (Memory/State) của Client để gửi kèm vào Header `Authorization: Bearer <token>` phục vụ xác thực nhanh.
*   **Refresh Token:** Có thời gian sống dài (ví dụ: nhiều ngày), được mã hóa và lưu trữ trong **HTTP-Only Cookie** ở trình duyệt với các cờ bảo mật `Secure` và `SameSite=Strict`. Điều này giúp:
    *   Ngăn chặn hoàn toàn mã độc JavaScript bên thứ ba truy cập và đánh cắp Refresh Token (Chống tấn công XSS).
    *   Client tự động gửi Refresh Token lên API `/api/v1/auth/refresh` để nhận Access Token mới khi Access Token cũ hết hạn mà không bắt người dùng phải đăng nhập lại, cải thiện đáng kể trải nghiệm khách hàng.

### 3. Pipeline Đánh Giá & Chấm Điểm CV Bằng AI (AI CV Matching Engine)
Quy trình xử lý tự động phân tích CV cực kỳ tinh vi:
```text
[ Tệp CV (PDF/Docx) ]
       │
       ▼ (1) Tải lên lưu trữ vật lý
[ File Storage ] ──► (2) Đọc luồng InputStream
       │
       ▼ (3) Trích xuất chữ thô
[ Apache Tika Engine ]
       │
       ▼ (4) Thiết lập Prompt kỹ thuật (CV + Job Description)
[ Prompt Compiler ]
       │
       ▼ (5) REST API Call (Cấu hình JSON Response Mime Type)
[ Google Gemini AI (1.5 Flash) ]
       │
       ▼ (6) Phân tích JSON phản hồi từ AI
[ AIMatchResponse ] ──► Trả về Client: { score: 85, reasoning: "..." }
```
1.  **Trích xuất văn bản:** Sử dụng luồng `InputStream` thông qua **Apache Tika** để trích xuất tự động văn bản thô từ bất kỳ định dạng tài liệu nào ứng viên tải lên hệ thống.
2.  **Prompt Engineering:** Kết hợp văn bản CV trích xuất với mô tả chi tiết công việc cùng danh sách kỹ năng yêu cầu của Job để biên dịch thành một Prompt chuyên sâu.
3.  **Structured JSON AI Output:** Cấu hình thuộc tính `responseMimeType: "application/json"` trên yêu cầu gửi tới Gemini API để ép mô hình AI trả về kết quả tuân thủ nghiêm ngặt định dạng đối tượng JSON mà không có bất kỳ ký tự Markdown dư thừa nào, giúp hệ thống hoạt động ổn định và tin cậy tuyệt đối.

### 4. Giao Tiếp Thời Gian Thực, Nhắn Tin Trực Tuyến & Gửi Thông Báo Tự Động
*   **STOMP WebSockets & Live Chat:** Cung cấp kênh kết nối thời gian thực `/ws`. Hỗ trợ hệ thống **Nhắn tin trực tuyến (Live Chat)** 1-1 giữa Ứng viên và Nhà tuyển dụng (HR/Admin) với trạng thái tin nhắn và số lượng tin chưa đọc.
*   **Thông báo trạng thái & Lịch phỏng vấn:** Khi HR cập nhật trạng thái CV (Từ `REVIEWING` sang `APPROVED`) hoặc khởi tạo lịch phỏng vấn, Backend lập tức đẩy thông báo thời gian thực đến kênh riêng của ứng viên (`/topic/notifications/{userId}`).
*   **Quản lý thông báo:** Người dùng có thể đọc, đánh dấu đã đọc, xóa từng thông báo hoặc xóa toàn bộ thông báo trực tiếp từ dropdown quả chuông ở thanh điều hướng.
*   **Spring Mail:** Đồng bộ hóa gửi mail thông báo lịch phỏng vấn tự động đến email của ứng viên với giao diện HTML thiết kế chuyên nghiệp hiển thị chi tiết thời gian, địa điểm/link họp và công ty.

### 5. Quản Lý Cấu Hình Hệ Thống Động (Dynamic Site Settings)
*   Cho phép Super Admin tùy biến Logo website, Tiêu đề trang, Banner Hero, Thông tin liên hệ và Mạng xã hội trực tiếp từ API và Admin UI mà không cần can thiệp vào mã nguồn.

---

## 📂 Sơ Đồ Cấu Trúc Mã Nguồn (Java Project Structure)

```text
src/main/java/thanhanh/job_recruitment/
  ├── config/             # Cấu hình hệ thống (WebSockets, Security, CORS, Database Seeder)
  │    ├── SecurityConfiguration.java   # Cấu hình bộ lọc bảo mật, phân quyền Endpoint tĩnh
  │    ├── PermissionInterceptor.java   # Kiểm tra quyền động từ database đối với người dùng
  │    ├── CorsConfig.java              # Cấu hình CORS cho phép các phương thức (bao gồm PATCH)
  │    └── DatabaseInitializer.java     # Database Seeding: Tạo tài khoản, vai trò, quyền mẫu
  ├── controller/         # Lớp Controller tiếp nhận HTTP Request, định tuyến API
  │    ├── AuthController.java          # Đăng nhập, đăng ký, refresh token
  │    ├── UserController.java          # Quản trị người dùng (Phân quyền scoped theo công ty của HR)
  │    ├── ChatController.java          # Nhắn tin thời gian thực 1-1 qua REST & WebSocket
  │    ├── SiteSettingController.java   # Cấu hình website động (Logo, Banner, Info)
  │    ├── InterviewScheduleController.java # Quản lý lịch phỏng vấn (Bypass cho ứng viên phản hồi)
  │    └── NotificationController.java  # Lấy, xóa và quản lý thông báo của người dùng
  ├── domain/             # Các JPA Entity định nghĩa cấu trúc bảng trong MySQL Database
  │    ├── User.java, Company.java, Job.java, Permission.java, Role.java
  │    ├── ChatMessage.java, ChatConversation.java # Lưu trữ tin nhắn và cuộc trò chuyện
  │    ├── SiteSetting.java             # Lưu cấu hình thương hiệu và website
  │    ├── InterviewSchedule.java       # Lưu lịch, trạng thái phản hồi và ghi chú đề xuất của ứng viên
  │    └── Notification.java            # Lưu trữ thông báo của người dùng
  ├── dto/                # Data Transfer Objects
  │    ├── request/       # DTO nhận dữ liệu đầu vào (Ví dụ: CandidateRespondInterviewRequest)
  │    └── response/      # DTO chuẩn hóa dữ liệu trả về cho client (Ví dụ: AIMatchResponse)
  ├── repository/         # Lớp truy vấn Database (Kế thừa JpaRepository & JpaSpecificationExecutor)
  ├── service/            # Interface định nghĩa các dịch vụ nghiệp vụ chính
  │    ├── impl/          # Hiện thực hóa chi tiết logic nghiệp vụ (Service Implementations)
  │    │    ├── ChatServiceImpl.java              # Nghiệp vụ trò chuyện và gửi tin nhắn
  │    │    ├── SiteSettingServiceImpl.java       # Nghiệp vụ quản lý cấu hình trang
  │    │    └── InterviewScheduleServiceImpl.java # Xử lý phản hồi lịch, cập nhật DB, thông báo WebSocket cho HR
  │    ├── FileExtractionService.java   # Trích xuất văn bản từ tệp CV qua Apache Tika
  │    └── GeminiAIService.java         # Gọi API Google Gemini chấm điểm độ tương thích
  └── util/               # Chứa các lớp tiện ích (Xử lý JWT, Custom API Response wrapper)
```

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

### Yêu cầu hệ thống:
*   Máy tính đã cài đặt **Java Development Kit (JDK) 21** trở lên.
*   Đã cài đặt hệ quản trị cơ sở dữ liệu **MySQL Server 8.x** trở lên.
*   Công cụ quản lý dự án **Maven** (đã tích hợp sẵn file wrapper `mvnw` trong dự án).

### Các bước thực hiện:

#### 1. Khởi tạo Cơ sở dữ liệu:
Mở MySQL Workbench, TablePlus hoặc Command Line của MySQL và chạy lệnh SQL sau để tạo cơ sở dữ liệu trống hỗ trợ tiếng Việt toàn diện:
```sql
CREATE DATABASE jobhunter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. Cấu hình các thông số hệ thống:
Mở tệp [application.properties](file:///d:/My_Project/Job-Recruitment-Java/src/main/resources/application.properties) và thiết lập các thông số cấu hình của bạn:

```properties
# 1. Cổng chạy server backend
server.port=8080

# 2. Cấu hình kết nối MySQL (Thay đổi tài khoản & mật khẩu phù hợp với MySQL của bạn)
spring.datasource.url=jdbc:mysql://localhost:3306/jobhunter?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# 3. Thư mục lưu trữ file CV khi ứng viên upload lên (đảm bảo đường dẫn này tồn tại trên máy)
upload-file.base-uri=file:///D:/My_Project/upload/

# 4. Cấu hình gửi Email qua Gmail (Cần tạo "Mật khẩu ứng dụng" trong cài đặt tài khoản Google)
spring.mail.username=email_cua_ban@gmail.com
spring.mail.password=mat_khau_ung_dung_gmail

# 5. Cấu hình Google Gemini API Key để chạy tính năng AI Match
gemini.api-key=API_KEY_GEMINI_CUA_BAN
```

#### 3. Khởi chạy Ứng dụng Backend:
Mở cửa sổ Command Prompt/PowerShell tại thư mục gốc của Java Backend và chạy lệnh:

*   **Trên hệ điều hành Windows (PowerShell):**
    ```powershell
    .\mvnw.cmd spring-boot:run
    ```
*   **Trên hệ điều hành Linux / macOS:**
    ```bash
    chmod +x mvnw
    ./mvnw spring-boot:run
    ```

Khi màn hình Terminal xuất hiện thông báo `Started JobRecruitmentApplication...` và chạy Database Seeding, hệ thống đã khởi chạy thành công. Ở lần chạy đầu tiên, Hibernate sẽ tự động đồng bộ hóa tạo toàn bộ cấu trúc bảng và seeder dữ liệu mẫu (Database Seeding) bao gồm các tài khoản, vai trò, quyền, công ty, job tuyển dụng và các CV mẫu để bạn có thể trải nghiệm ngay lập tức.

#### 4. Xem tài liệu API (Swagger UI) & Demo Accounts:
Bạn truy cập tài liệu API trực quan hóa theo đường dẫn:
`http://localhost:8080/swagger-ui.html`

Tài khoản trải nghiệm mẫu:
*   👑 **Super Admin:** `admin@gmail.com` / `123456`
*   🏢 **HR Recruiter:** `hr@gmail.com` / `123456`
*   👨‍💻 **Candidate:** `thanhanh818757@gmail.com` / `123456`
