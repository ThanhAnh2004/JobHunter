-- =====================================================================
-- JOBHUNTER PLATFORM - COMPREHENSIVE SAMPLE DATA SEED SCRIPT
-- Bao gồm: Skills, Companies, HRs, Candidates, Jobs, Job_Skills, Resumes, Interviews, Chat & Notifications
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. SEED SKILLS
INSERT INTO `skills` (`id`, `name`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`) VALUES
(1, 'Java', NOW(), NOW(), 'system', 'system'),
(2, 'Spring Boot', NOW(), NOW(), 'system', 'system'),
(3, 'Spring Cloud', NOW(), NOW(), 'system', 'system'),
(4, 'ReactJS', NOW(), NOW(), 'system', 'system'),
(5, 'NextJS', NOW(), NOW(), 'system', 'system'),
(6, 'TypeScript', NOW(), NOW(), 'system', 'system'),
(7, 'JavaScript', NOW(), NOW(), 'system', 'system'),
(8, 'Node.js', NOW(), NOW(), 'system', 'system'),
(9, 'NestJS', NOW(), NOW(), 'system', 'system'),
(10, 'Python', NOW(), NOW(), 'system', 'system'),
(11, 'Golang', NOW(), NOW(), 'system', 'system'),
(12, 'Docker', NOW(), NOW(), 'system', 'system'),
(13, 'Kubernetes', NOW(), NOW(), 'system', 'system'),
(14, 'AWS', NOW(), NOW(), 'system', 'system'),
(15, 'MySQL', NOW(), NOW(), 'system', 'system'),
(16, 'PostgreSQL', NOW(), NOW(), 'system', 'system'),
(17, 'MongoDB', NOW(), NOW(), 'system', 'system'),
(18, 'Redis', NOW(), NOW(), 'system', 'system'),
(19, 'Kafka', NOW(), NOW(), 'system', 'system'),
(20, 'Flutter', NOW(), NOW(), 'system', 'system'),
(21, 'CI/CD', NOW(), NOW(), 'system', 'system'),
(22, 'Microservices', NOW(), NOW(), 'system', 'system'),
(23, 'System Design', NOW(), NOW(), 'system', 'system'),
(24, 'QA Testing', NOW(), NOW(), 'system', 'system')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. SEED COMPANIES
INSERT INTO `companies` (`id`, `name`, `description`, `address`, `logo`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`) VALUES
(1, 'VNG Corporation', 'Kỳ lân công nghệ hàng đầu Việt Nam, phát triển Zalo, Zing, VNG Cloud và nền tảng game toàn cầu.', 'VNG Campus, Tân Thuận Đông, Quận 7, TP.HCM', 'vng.png', NOW(), NOW(), 'system', 'system'),
(2, 'FPT Software', 'Tập đoàn công nghệ và xuất khẩu phần mềm số 1 Việt Nam, đối tác chiến lược của các tập đoàn Fortune 500.', 'F-Town 3, Khu Công nghệ Cao, TP.Thủ Đức, TP.HCM', 'fpt.png', NOW(), NOW(), 'system', 'system'),
(3, 'Shopee Vietnam', 'Sàn thương mại điện tử hàng đầu Đông Nam Á, trực thuộc tập đoàn công nghệ Sea Group.', 'Saigon Centre Tower 2, Quận 1, TP.HCM', 'shopee.png', NOW(), NOW(), 'system', 'system'),
(4, 'MoMo (M-Service)', 'Siêu ứng dụng thanh toán & tài chính số 1 Việt Nam phục vụ hơn 30 triệu người dùng.', 'Tòa nhà Phú Mỹ Hưng, Quận 7, TP.HCM', 'momo.png', NOW(), NOW(), 'system', 'system'),
(5, 'Viettel Solutions', 'Tổng công ty Giải pháp Doanh nghiệp Viettel - Đơn vị tiên phong chuyển đổi số quốc gia.', 'Tòa nhà Viettel, Cầu Giấy, Hà Nội', 'viettel.png', NOW(), NOW(), 'system', 'system'),
(6, 'One Mount Group', 'Hệ sinh thái công nghệ số lớn nhất Việt Nam sở hữu VinShop, VinID và OneHousing.', 'Times City, Hai Bà Trưng, Hà Nội', 'onemount.svg', NOW(), NOW(), 'system', 'system'),
(7, 'KMS Technology', 'Công ty dịch vụ phần mềm quốc tế hàng đầu thị trường Bắc Mỹ với hơn 15 năm uy tín.', 'Tân Bình, TP.HCM', 'kms.svg', NOW(), NOW(), 'system', 'system'),
(8, 'NashTech Vietnam', 'Tập đoàn tư vấn giải pháp công nghệ và chuyển đổi số toàn cầu thuộc Harvey Nash Group.', 'Quận 3, TP.HCM', 'nashtech.svg', NOW(), NOW(), 'system', 'system')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `address` = VALUES(`address`), `logo` = VALUES(`logo`);

-- 3. SEED USERS (Password: 123456 -> $2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli)
-- Admin & HRs: Role ID 1 (SUPER_ADMIN) / Role ID 2 (HR) / Role ID 3 (USER)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `age`, `gender`, `address`, `role_id`, `company_id`, `createdAt`, `updatedAt`, `createdBy`) VALUES
(1, 'Super Admin', 'admin@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 25, 'MALE', 'Hà Nội', 1, NULL, NOW(), NOW(), 'system'),
(101, 'Hoàng Thùy Linh (HR VNG)', 'hr_vng@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 28, 'FEMALE', 'TP.HCM', 2, 1, NOW(), NOW(), 'system'),
(102, 'Nguyễn Thu Hà (HR FPT)', 'hr_fpt@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 27, 'FEMALE', 'Hà Nội', 2, 2, NOW(), NOW(), 'system'),
(103, 'Trần Minh Tuấn (HR Shopee)', 'hr_shopee@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 29, 'MALE', 'TP.HCM', 2, 3, NOW(), NOW(), 'system'),
(104, 'Lê Phương Thảo (HR MoMo)', 'hr_momo@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 26, 'FEMALE', 'TP.HCM', 2, 4, NOW(), NOW(), 'system'),
(105, 'Đặng Quốc Bảo (HR Viettel)', 'hr_viettel@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 30, 'MALE', 'Hà Nội', 2, 5, NOW(), NOW(), 'system'),
(106, 'Phạm Mai Chi (HR One Mount)', 'hr_onemount@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 28, 'FEMALE', 'Hà Nội', 2, 6, NOW(), NOW(), 'system'),
(107, 'Vũ Hoàng Nam (HR KMS)', 'hr_kms@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 31, 'MALE', 'TP.HCM', 2, 7, NOW(), NOW(), 'system'),
(108, 'Đỗ Hải Đăng (HR NashTech)', 'hr_nashtech@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 29, 'MALE', 'TP.HCM', 2, 8, NOW(), NOW(), 'system'),
(109, 'HR General (Shopee)', 'hr@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 26, 'FEMALE', 'TP.HCM', 2, 3, NOW(), NOW(), 'system'),

-- Candidates
(201, 'Lô Thanh Anh', 'thanhanh818757@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 22, 'MALE', 'TP.HCM', 3, NULL, NOW(), NOW(), 'system'),
(202, 'Nguyễn Văn Nam', 'nam.nguyen@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 25, 'MALE', 'Hà Nội', 3, NULL, NOW(), NOW(), 'system'),
(203, 'Trần Thị Mai', 'mai.tran@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 24, 'FEMALE', 'Đà Nẵng', 3, NULL, NOW(), NOW(), 'system'),
(204, 'Lê Hoàng Long', 'long.le@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 27, 'MALE', 'TP.HCM', 3, NULL, NOW(), NOW(), 'system'),
(205, 'Phạm Minh Đức', 'duc.pham@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 26, 'MALE', 'Hà Nội', 3, NULL, NOW(), NOW(), 'system'),
(206, 'Vũ Thu Trang', 'trang.vu@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 23, 'FEMALE', 'TP.HCM', 3, NULL, NOW(), NOW(), 'system'),
(207, 'Đỗ Tuấn Kiệt', 'kiet.do@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 28, 'MALE', 'TP.HCM', 3, NULL, NOW(), NOW(), 'system'),
(208, 'Hoàng Bảo Ngọc', 'ngoc.hoang@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 24, 'FEMALE', 'Hà Nội', 3, NULL, NOW(), NOW(), 'system'),
(209, 'Bùi Thanh Sơn', 'son.bui@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 29, 'MALE', 'Đà Nẵng', 3, NULL, NOW(), NOW(), 'system'),
(210, 'Đinh Thảo Vy', 'vy.dinh@gmail.com', '$2a$10$tf9ua6/i9bZAN40cH.i29..JQrY9Q6Excrl0iXZcUEVI6uJg9ipli', 25, 'FEMALE', 'TP.HCM', 3, NULL, NOW(), NOW(), 'system')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `role_id` = VALUES(`role_id`), `company_id` = VALUES(`company_id`);

-- 4. SEED JOBS
INSERT INTO `jobs` (`id`, `name`, `location`, `salary`, `quantity`, `level`, `description`, `start_date`, `end_date`, `active`, `company_id`, `createdAt`, `updatedAt`, `createdBy`) VALUES
(1, 'Senior Java Backend Engineer (Spring Cloud / Microservices)', 'TP.HCM', 45000000, 3, 'SENIOR', 'Thiết kế và phát triển các hệ thống Microservices quy mô lớn phục vụ hàng triệu người dùng tại VNG. Yêu cầu thành thạo Java 21, Spring Boot, Spring Cloud, Apache Kafka, Redis, Docker/K8s và tối ưu hóa truy vấn Database.', NOW() - INTERVAL 10 DAY, NOW() + INTERVAL 60 DAY, 1, 1, NOW(), NOW(), 'system'),
(2, 'Lead ReactJS / Next.js Frontend Developer', 'TP.HCM', 40000000, 2, 'SENIOR', 'Xây dựng kiến trúc giao diện Web Portal hiệu năng cao với React 18, Next.js, TypeScript. Yêu cầu kinh nghiệm tối ưu hóa Core Web Vitals, SSR/SSG, State Management với Redux Toolkit / Zustand.', NOW() - INTERVAL 10 DAY, NOW() + INTERVAL 60 DAY, 1, 1, NOW(), NOW(), 'system'),
(3, 'Junior Java / Spring Boot Developer', 'Hà Nội', 18000000, 5, 'JUNIOR', 'Tham gia các dự án phát triển phần mềm cho đối tác Nhật Bản & Mỹ. Yêu cầu nắm vững OOP, Spring Boot REST API, Hibernate/JPA, MySQL và có tinh thần ham học hỏi, trách nhiệm cao.', NOW() - INTERVAL 8 DAY, NOW() + INTERVAL 50 DAY, 1, 2, NOW(), NOW(), 'system'),
(4, 'Middle Fullstack Developer (React & Node.js)', 'Đà Nẵng', 28000000, 4, 'MIDDLE', 'Phát triển ứng dụng Web toàn diện từ Frontend (React/TypeScript) đến Backend (Node.js/NestJS, PostgreSQL). Yêu cầu kinh nghiệm viết Clean Code, Unit Test và làm việc theo mô hình Agile/Scrum.', NOW() - INTERVAL 7 DAY, NOW() + INTERVAL 45 DAY, 1, 2, NOW(), NOW(), 'system'),
(5, 'DevOps & Cloud AWS Engineer', 'TP.HCM', 50000000, 2, 'SENIOR', 'Thiết lập và tự động hóa hệ thống CI/CD, quản trị hạ tầng Cloud AWS quy mô lớn, giám sát Kubernetes (EKS), tối ưu chi phí hạ tầng và đảm bảo High Availability 99.99%.', NOW() - INTERVAL 6 DAY, NOW() + INTERVAL 40 DAY, 1, 3, NOW(), NOW(), 'system'),
(6, 'Senior Golang Backend Engineer (High Concurrency)', 'TP.HCM', 55000000, 3, 'SENIOR', 'Phát triển lõi dịch vụ xử lý thanh toán và khuyến mại thời gian thực với lượng truy cập cực lớn trong các đợt Siêu Sale. Yêu cầu kinh nghiệm Go Concurrency (Goroutines/Channels), Redis, Kafka.', NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 30 DAY, 1, 3, NOW(), NOW(), 'system'),
(7, 'Mobile Flutter Developer (iOS & Android)', 'TP.HCM', 32000000, 3, 'MIDDLE', 'Phát triển các mini-app và tính năng thanh toán tài chính trên Siêu ứng dụng MoMo bằng Flutter. Yêu cầu thành thạo Clean Architecture, Bloc/Riverpod, tối ưu bộ nhớ và Animation mượt mà.', NOW() - INTERVAL 4 DAY, NOW() + INTERVAL 35 DAY, 1, 4, NOW(), NOW(), 'system'),
(8, 'Senior Data Engineer & AI Specialist (PySpark / Airflow)', 'TP.HCM', 52000000, 2, 'SENIOR', 'Xây dựng Big Data Pipeline xử lý dữ liệu giao dịch hàng ngày, tích hợp mô hình Machine Learning phát hiện gian lận thanh toán. Yêu cầu PySpark, Apache Airflow, Data Lakehouse.', NOW() - INTERVAL 4 DAY, NOW() + INTERVAL 45 DAY, 1, 4, NOW(), NOW(), 'system'),
(9, 'Core Banking Java Software Engineer', 'Hà Nội', 48000000, 4, 'SENIOR', 'Phát triển giải pháp tài chính và ngân hàng số cho các ngân hàng và tổ chức chính phủ. Yêu cầu chuyên sâu Java Core, Spring Boot, Oracle/PostgreSQL, bảo mật hệ thống và kiến trúc phân tán.', NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 50 DAY, 1, 5, NOW(), NOW(), 'system'),
(10, 'Solution Architect (Cloud Native & Enterprise)', 'Hà Nội', 75000000, 1, 'SENIOR', 'Chịu trách nhiệm thiết kế kiến trúc kỹ thuật tổng thể cho các siêu dự án cấp quốc gia. Định hướng công nghệ Cloud Native, Microservices, Security, tư vấn giải pháp cho khách hàng lớn.', NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 60 DAY, 1, 5, NOW(), NOW(), 'system'),
(11, 'Frontend Fresher React / Vue Developer', 'Hà Nội', 12000000, 6, 'FRESHER', 'Được đào tạo bài bản bởi các Tech Lead hàng đầu. Tham gia phát triển giao diện hệ thống VinID / OneHousing. Yêu cầu tư duy lập trình tốt, nắm chắc JavaScript ES6+, HTML5/CSS3.', NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 30 DAY, 1, 6, NOW(), NOW(), 'system'),
(12, 'QA Automation Engineer (Java / Selenium / Cypress)', 'TP.HCM', 28000000, 3, 'MIDDLE', 'Xây dựng Automation Test Framework cho các dự án phần mềm y tế và tài chính Bắc Mỹ. Yêu cầu thành thạo Selenium/Cypress, Java/TypeScript, CI/CD và Performance Testing.', NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 45 DAY, 1, 7, NOW(), NOW(), 'system'),
(13, 'Cloud Infrastructure & Security Engineer', 'TP.HCM', 42000000, 2, 'SENIOR', 'Thiết kế và triển khai kiến trúc Cloud AWS/Azure an toàn, cấu hình WAF, tuân thủ tiêu chuẩn bảo mật quốc tế ISO 27001 và SOC2.', NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 40 DAY, 1, 8, NOW(), NOW(), 'system'),
(14, 'Backend Node.js / NestJS Middle Engineer', 'TP.HCM', 30000000, 3, 'MIDDLE', 'Xây dựng hệ thống Backend API cho các dịch vụ mạng xã hội và giải trí. Yêu cầu thành thạo TypeScript, NestJS, MongoDB, Redis Caching và Message Queue.', NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 40 DAY, 1, 1, NOW(), NOW(), 'system')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `salary` = VALUES(`salary`), `active` = VALUES(`active`);

-- 5. SEED JOB_SKILL RELATIONS
DELETE FROM `job_skill`;
INSERT INTO `job_skill` (`job_id`, `skill_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 12), (1, 18), (1, 19), (1, 22),
(2, 4), (2, 5), (2, 6), (2, 7),
(3, 1), (3, 2), (3, 15), (3, 21),
(4, 4), (4, 6), (4, 8), (4, 9), (4, 16),
(5, 12), (5, 13), (5, 14), (5, 21),
(6, 11), (6, 15), (6, 18), (6, 19), (6, 22), (6, 23),
(7, 20), (7, 6), (7, 15), (7, 18),
(8, 10), (8, 15), (8, 16), (8, 19),
(9, 1), (9, 2), (9, 16), (9, 22), (9, 23),
(10, 23), (10, 14), (10, 13), (10, 1), (10, 11), (10, 22),
(11, 4), (11, 6), (11, 7),
(12, 24), (12, 1), (12, 6), (12, 21),
(13, 14), (13, 12), (13, 13), (13, 21),
(14, 8), (14, 9), (14, 6), (14, 17), (14, 18);

-- 6. SEED RESUMES / APPLICATIONS
DELETE FROM `resumes`;
INSERT INTO `resumes` (`id`, `email`, `url`, `status`, `user_id`, `job_id`, `createdAt`, `updatedAt`, `createdBy`) VALUES
(1, 'thanhanh818757@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'APPROVED', 201, 1, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 2 DAY, 'thanhanh818757@gmail.com'),
(2, 'thanhanh818757@gmail.com', '1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx', 'REVIEWING', 201, 2, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 1 DAY, 'thanhanh818757@gmail.com'),
(3, 'nam.nguyen@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'APPROVED', 202, 5, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 2 DAY, 'nam.nguyen@gmail.com'),
(4, 'nam.nguyen@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'PENDING', 202, 13, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, 'nam.nguyen@gmail.com'),
(5, 'mai.tran@gmail.com', '1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx', 'APPROVED', 203, 3, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'mai.tran@gmail.com'),
(6, 'mai.tran@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'REVIEWING', 203, 4, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY, 'mai.tran@gmail.com'),
(7, 'long.le@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'APPROVED', 204, 6, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 2 DAY, 'long.le@gmail.com'),
(8, 'long.le@gmail.com', '1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx', 'REVIEWING', 204, 1, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'long.le@gmail.com'),
(9, 'duc.pham@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'APPROVED', 205, 9, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'duc.pham@gmail.com'),
(10, 'duc.pham@gmail.com', '1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx', 'PENDING', 205, 3, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, 'duc.pham@gmail.com'),
(11, 'trang.vu@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'APPROVED', 206, 7, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 1 DAY, 'trang.vu@gmail.com'),
(12, 'trang.vu@gmail.com', '1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx', 'PENDING', 206, 11, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, 'trang.vu@gmail.com'),
(13, 'kiet.do@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'APPROVED', 207, 8, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 1 DAY, 'kiet.do@gmail.com'),
(14, 'kiet.do@gmail.com', '1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx', 'REVIEWING', 207, 14, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'kiet.do@gmail.com'),
(15, 'ngoc.hoang@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'REVIEWING', 208, 12, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY, 'ngoc.hoang@gmail.com'),
(16, 'son.bui@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'PENDING', 209, 10, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, 'son.bui@gmail.com'),
(17, 'son.bui@gmail.com', '1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx', 'REJECTED', 209, 5, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 1 DAY, 'son.bui@gmail.com'),
(18, 'vy.dinh@gmail.com', '1782945950047-Lo-Thanh-Anh-CV-Backend.pdf', 'APPROVED', 210, 11, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 'vy.dinh@gmail.com'),
(19, 'vy.dinh@gmail.com', '1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx', 'REJECTED', 210, 2, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 1 DAY, 'vy.dinh@gmail.com');

-- 7. SEED INTERVIEW SCHEDULES
DELETE FROM `interview_schedules`;
INSERT INTO `interview_schedules` (`id`, `title`, `interview_time`, `location`, `status`, `candidate_note`, `candidate_id`, `job_id`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'Phỏng vấn Vòng Kỹ Thuật (Technical Round) - VNG', NOW() + INTERVAL 2 DAY, 'Online qua Google Meet (https://meet.google.com/abc-xyz-vng)', 'ACCEPTED', 'Em đã nhận được thông tin và xác nhận tham gia đúng giờ qua link Google Meet. Em cảm ơn quý công ty.', 201, 1, NOW() - INTERVAL 1 DAY, NOW(), 'hr_vng@gmail.com'),
(2, 'Phỏng vấn Trực Tiếp tại Văn Phòng VNG Campus', NOW() + INTERVAL 4 DAY, 'Phòng họp Star 3, Tầng 4, VNG Campus, Quận 7, TP.HCM', 'SCHEDULED', NULL, 201, 2, NOW(), NOW(), 'hr_vng@gmail.com'),
(3, 'Phỏng vấn System Architecture & Live Coding - Shopee', NOW() + INTERVAL 3 DAY, 'Online qua Zoom Meeting (ID: 889 1234 5678 - Pass: 123456)', 'ACCEPTED', 'Tôi đã sẵn sàng tham gia phỏng vấn.', 202, 5, NOW() - INTERVAL 1 DAY, NOW(), 'hr_shopee@gmail.com'),
(4, 'Phỏng vấn Kỹ Năng Lập Trình & Tư Duy Giải Thuật - FPT', NOW() + INTERVAL 1 DAY, 'Online qua Microsoft Teams', 'ACCEPTED', 'Dạ em đã chuẩn bị môi trường code và sẵn sàng phỏng vấn ạ.', 203, 3, NOW() - INTERVAL 1 DAY, NOW(), 'hr_fpt@gmail.com'),
(5, 'Phỏng vấn Mobile Architecture & Performance - MoMo', NOW() - INTERVAL 2 DAY, 'Tòa nhà Phú Mỹ Hưng, Quận 7, TP.HCM', 'COMPLETED', 'Đã hoàn thành xuất sắc vòng phỏng vấn kỹ thuật.', 206, 7, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 2 DAY, 'hr_momo@gmail.com'),
(6, 'Phỏng vấn Big Data & AI Model - MoMo', NOW() + INTERVAL 5 DAY, 'Online qua Google Meet (https://meet.google.com/momo-data-tech)', 'SCHEDULED', NULL, 207, 8, NOW(), NOW(), 'hr_momo@gmail.com');

-- 8. SEED LIVE CHAT CONVERSATIONS & MESSAGES
DELETE FROM `chat_messages`;
DELETE FROM `conversations`;

INSERT INTO `conversations` (`id`, `candidate_id`, `company_id`, `job_id`, `last_message`, `last_message_at`, `last_sender_id`, `unread_candidate`, `unread_hr`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 201, 1, 1, 'Dạ em đã nhận được lịch và bấm xác nhận tham gia rồi ạ. Cảm ơn chị nhiều!', NOW() - INTERVAL 20 MINUTE, 201, 0, 0, NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 20 MINUTE, 'thanhanh818757@gmail.com');

INSERT INTO `chat_messages` (`id`, `conversation_id`, `sender_id`, `content`, `type`, `is_read`, `created_at`) VALUES
(1, 1, 201, 'Chào chị Thùy Linh, em đã nộp hồ sơ ứng tuyển vị trí Senior Java Backend tại VNG ạ.', 'TEXT', 1, NOW() - INTERVAL 3 HOUR),
(2, 1, 101, 'Chào Thanh Anh, chị đã nhận được CV của em. Hồ sơ của em rất ấn tượng về kinh nghiệm Spring Boot và Microservices!', 'TEXT', 1, NOW() - INTERVAL 2 HOUR),
(3, 1, 101, 'Chị vừa gửi lịch hẹn phỏng vấn kỹ thuật vào 14:30 thứ Năm tuần này qua Google Meet, em check xác nhận nhé.', 'TEXT', 1, NOW() - INTERVAL 1 HOUR),
(4, 1, 201, 'Dạ em đã nhận được lịch và bấm xác nhận tham gia rồi ạ. Cảm ơn chị nhiều!', 'TEXT', 1, NOW() - INTERVAL 20 MINUTE);

-- 9. SEED NOTIFICATIONS
DELETE FROM `notifications`;
INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(1, 201, 'Công ty VNG Corporation đã cập nhật trạng thái hồ sơ của bạn thành: ĐẠT YÊU CẦU (APPROVED)', 0, NOW() - INTERVAL 2 HOUR),
(2, 201, 'Bạn có 1 lịch phỏng vấn mới từ VNG Corporation vào lúc 14:30 ngày 19/09/2026.', 0, NOW() - INTERVAL 1 HOUR),
(3, 201, 'Hệ thống gợi ý: Có 3 công việc mới phù hợp với kỹ năng Java, Spring Boot của bạn!', 1, NOW() - INTERVAL 1 DAY);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- SUCCESS: SEED DATA GENERATION COMPLETE!
-- =====================================================================
