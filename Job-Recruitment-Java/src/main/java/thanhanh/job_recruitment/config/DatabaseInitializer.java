package thanhanh.job_recruitment.config;

import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import thanhanh.job_recruitment.domain.*;
import thanhanh.job_recruitment.repository.*;
import thanhanh.job_recruitment.util.constant.GenderEnum;
import thanhanh.job_recruitment.util.constant.InterviewStateEnum;
import thanhanh.job_recruitment.util.constant.LevelEnum;
import thanhanh.job_recruitment.util.constant.ResumeStateEnum;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@AllArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final ResumeRepository resumeRepository;
    private final InterviewScheduleRepository interviewScheduleRepository;
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final NotificationRepository notificationRepository;
    private final SiteSettingRepository siteSettingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println(">>> =========================================");
        System.out.println(">>> START DATABASE INITIALIZATION & DATA SEEDING");
        System.out.println(">>> =========================================");

        initPermissions();
        initRoles();
        initDefaultSiteSettings();
        initAdminUser();
        initComprehensiveData();

        System.out.println(">>> =========================================");
        System.out.println(">>> DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!");
        System.out.println(">>> =========================================");
    }

    private void initPermissions() {
        if (this.permissionRepository.count() == 0) {
            ArrayList<Permission> arr = new ArrayList<>();
            arr.add(new Permission("Create a company", "/api/v1/companies", "POST", "COMPANIES"));
            arr.add(new Permission("Update a company", "/api/v1/companies", "PUT", "COMPANIES"));
            arr.add(new Permission("Delete a company", "/api/v1/companies/{id}", "DELETE", "COMPANIES"));
            arr.add(new Permission("Get a company by id", "/api/v1/companies/{id}", "GET", "COMPANIES"));
            arr.add(new Permission("Get companies with pagination", "/api/v1/companies", "GET", "COMPANIES"));

            arr.add(new Permission("Create a job", "/api/v1/jobs", "POST", "JOBS"));
            arr.add(new Permission("Update a job", "/api/v1/jobs", "PUT", "JOBS"));
            arr.add(new Permission("Delete a job", "/api/v1/jobs/{id}", "DELETE", "JOBS"));
            arr.add(new Permission("Get a job by id", "/api/v1/jobs/{id}", "GET", "JOBS"));
            arr.add(new Permission("Get jobs with pagination", "/api/v1/jobs", "GET", "JOBS"));

            arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
            arr.add(new Permission("Update a permission", "/api/v1/permissions", "PUT", "PERMISSIONS"));
            arr.add(new Permission("Delete a permission", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
            arr.add(new Permission("Get a permission by id", "/api/v1/permissions/{id}", "GET", "PERMISSIONS"));
            arr.add(new Permission("Get permissions with pagination", "/api/v1/permissions", "GET", "PERMISSIONS"));

            arr.add(new Permission("Create a resume", "/api/v1/resumes", "POST", "RESUMES"));
            arr.add(new Permission("Update a resume", "/api/v1/resumes", "PUT", "RESUMES"));
            arr.add(new Permission("Delete a resume", "/api/v1/resumes/{id}", "DELETE", "RESUMES"));
            arr.add(new Permission("Get a resume by id", "/api/v1/resumes/{id}", "GET", "RESUMES"));
            arr.add(new Permission("Get resumes with pagination", "/api/v1/resumes", "GET", "RESUMES"));

            arr.add(new Permission("Create a role", "/api/v1/roles", "POST", "ROLES"));
            arr.add(new Permission("Update a role", "/api/v1/roles", "PUT", "ROLES"));
            arr.add(new Permission("Delete a role", "/api/v1/roles/{id}", "DELETE", "ROLES"));
            arr.add(new Permission("Get a role by id", "/api/v1/roles/{id}", "GET", "ROLES"));
            arr.add(new Permission("Get roles with pagination", "/api/v1/roles", "GET", "ROLES"));

            arr.add(new Permission("Create a user", "/api/v1/users", "POST", "USERS"));
            arr.add(new Permission("Update a user", "/api/v1/users", "PUT", "USERS"));
            arr.add(new Permission("Delete a user", "/api/v1/users/{id}", "DELETE", "USERS"));
            arr.add(new Permission("Get a user by id", "/api/v1/users/{id}", "GET", "USERS"));
            arr.add(new Permission("Get users with pagination", "/api/v1/users", "GET", "USERS"));

            arr.add(new Permission("Create a subscriber", "/api/v1/subscribers", "POST", "SUBSCRIBERS"));
            arr.add(new Permission("Update a subscriber", "/api/v1/subscribers", "PUT", "SUBSCRIBERS"));
            arr.add(new Permission("Delete a subscriber", "/api/v1/subscribers/{id}", "DELETE", "SUBSCRIBERS"));
            arr.add(new Permission("Get a subscriber by id", "/api/v1/subscribers/{id}", "GET", "SUBSCRIBERS"));
            arr.add(new Permission("Get subscribers with pagination", "/api/v1/subscribers", "GET", "SUBSCRIBERS"));

            arr.add(new Permission("Download a file", "/api/v1/files", "POST", "FILES"));
            arr.add(new Permission("Upload a file", "/api/v1/files", "GET", "FILES"));

            this.permissionRepository.saveAll(arr);
        }

        // Tự động kiểm tra và thêm các quyền hạn còn thiếu
        initMissingPermission("Get conversations", "/api/v1/chat/conversations", "GET", "CHATS");
        initMissingPermission("Create or get conversation", "/api/v1/chat/conversations", "POST", "CHATS");
        initMissingPermission("Get conversation by id", "/api/v1/chat/conversations/{id}", "GET", "CHATS");
        initMissingPermission("Get messages of conversation", "/api/v1/chat/conversations/{id}/messages", "GET", "CHATS");
        initMissingPermission("Send a message", "/api/v1/chat/messages", "POST", "CHATS");
        initMissingPermission("Mark conversation as read", "/api/v1/chat/conversations/{id}/read", "PATCH", "CHATS");
        initMissingPermission("Get chat badge count", "/api/v1/chat/badge", "GET", "CHATS");

        initMissingPermission("Create an interview", "/api/v1/interviews", "POST", "INTERVIEWS");
        initMissingPermission("Update an interview", "/api/v1/interviews", "PUT", "INTERVIEWS");
        initMissingPermission("Delete an interview", "/api/v1/interviews/{id}", "DELETE", "INTERVIEWS");
        initMissingPermission("Get an interview by id", "/api/v1/interviews/{id}", "GET", "INTERVIEWS");
        initMissingPermission("Get interviews with pagination", "/api/v1/interviews", "GET", "INTERVIEWS");
        initMissingPermission("Candidate responds to interview", "/api/v1/interviews/candidate-respond", "PATCH", "INTERVIEWS");

        initMissingPermission("Get all site settings", "/api/v1/settings", "GET", "SETTINGS");
        initMissingPermission("Get site setting by key", "/api/v1/settings/{key}", "GET", "SETTINGS");
        initMissingPermission("Update site setting", "/api/v1/settings/{key}", "PUT", "SETTINGS");
        initMissingPermission("Batch update site settings", "/api/v1/settings", "POST", "SETTINGS");
    }

    private void initRoles() {
        List<Permission> allPermissions = this.permissionRepository.findAll();

        // 1. SUPER_ADMIN Role
        Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
        if (adminRole == null) {
            adminRole = new Role();
            adminRole.setName("SUPER_ADMIN");
            adminRole.setDescription("Super Admin - Full permissions across system");
            adminRole.setActive(true);
        }
        adminRole.setPermissions(allPermissions);
        this.roleRepository.save(adminRole);

        // 2. HR Role
        List<Permission> hrPerms = allPermissions.stream()
                .filter(p -> "CHATS".equals(p.getModule())
                        || "JOBS".equals(p.getModule())
                        || "RESUMES".equals(p.getModule())
                        || "INTERVIEWS".equals(p.getModule())
                        || "FILES".equals(p.getModule())
                        || ("COMPANIES".equals(p.getModule()) && !"DELETE".equals(p.getMethod()))
                )
                .toList();

        Role hrRole = this.roleRepository.findByName("HR");
        if (hrRole == null) {
            hrRole = new Role();
            hrRole.setName("HR");
            hrRole.setDescription("HR representative for company");
            hrRole.setActive(true);
        }
        hrRole.setPermissions(new ArrayList<>(hrPerms));
        this.roleRepository.save(hrRole);

        // 3. USER / CANDIDATE Role
        Role userRole = this.roleRepository.findByName("USER");
        if (userRole == null) {
            userRole = new Role();
            userRole.setName("USER");
            userRole.setDescription("Candidate / Normal User");
            userRole.setActive(true);
        }
        List<Permission> userPerms = allPermissions.stream()
                .filter(p -> "CHATS".equals(p.getModule())
                        || "FILES".equals(p.getModule())
                        || ("JOBS".equals(p.getModule()) && "GET".equals(p.getMethod()))
                        || ("COMPANIES".equals(p.getModule()) && "GET".equals(p.getMethod()))
                        || ("RESUMES".equals(p.getModule()) && ("POST".equals(p.getMethod()) || "GET".equals(p.getMethod())))
                        || ("INTERVIEWS".equals(p.getModule()) && ("GET".equals(p.getMethod()) || "PATCH".equals(p.getMethod())))
                        || "SUBSCRIBERS".equals(p.getModule())
                )
                .toList();
        userRole.setPermissions(new ArrayList<>(userPerms));
        this.roleRepository.save(userRole);
    }

    private void initAdminUser() {
        if (!this.userRepository.existsByEmail("admin@gmail.com")) {
            User adminUser = new User();
            adminUser.setEmail("admin@gmail.com");
            adminUser.setAddress("Hà Nội");
            adminUser.setAge(25);
            adminUser.setGender(GenderEnum.MALE);
            adminUser.setName("Super Admin");
            adminUser.setPassword(this.passwordEncoder.encode("123456"));

            Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
            if (adminRole != null) {
                adminUser.setRole(adminRole);
            }
            this.userRepository.save(adminUser);
            System.out.println(">>> INITIALIZED DEFAULT ADMIN: admin@gmail.com / 123456");
        }
    }

    private void initMissingPermission(String name, String apiPath, String method, String module) {
        boolean exists = this.permissionRepository.existsByApiPathAndMethod(apiPath, method);
        if (!exists) {
            Permission p = new Permission(name, apiPath, method, module);
            this.permissionRepository.save(p);
            System.out.println(">>> ADDED MISSING PERMISSION: " + name + " [" + method + " " + apiPath + "]");
        }
    }

    /**
     * Tự động sinh dữ liệu mẫu đầy đủ cho hệ thống:
     * Skills, Companies, HR Users, Candidate Users, Jobs, Resumes, Interview Schedules, Chat Messages.
     */
    private void initComprehensiveData() {
        System.out.println(">>> CHECKING & SEEDING COMPREHENSIVE SAMPLE DATA...");

        Role hrRole = this.roleRepository.findByName("HR");
        Role userRole = this.roleRepository.findByName("USER");

        // 1. TẠO DANH SÁCH KỸ NĂNG (SKILLS)
        Map<String, Skill> skillMap = new HashMap<>();
        String[] skillNames = {
                "Java", "Spring Boot", "Spring Cloud", "ReactJS", "NextJS", "TypeScript",
                "JavaScript", "Node.js", "NestJS", "Python", "Golang", "Docker",
                "Kubernetes", "AWS", "MySQL", "PostgreSQL", "MongoDB", "Redis",
                "Kafka", "Flutter", "CI/CD", "Microservices", "System Design", "QA Testing"
        };
        for (String sName : skillNames) {
            Skill skill = this.skillRepository.findByName(sName).orElseGet(() -> {
                Skill s = new Skill();
                s.setName(sName);
                s.setCreatedBy("system");
                return this.skillRepository.save(s);
            });
            skillMap.put(sName, skill);
        }
        System.out.println(">>> CHECKED & INITIALIZED " + skillMap.size() + " SKILLS.");

        // 2. TẠO CÁC CÔNG TY HÀNG ĐẦU (COMPANIES)
        Map<String, Company> companyMap = new HashMap<>();
        List<CompanySeedData> companiesToSeed = List.of(
                new CompanySeedData("VNG Corporation", "Kỳ lân công nghệ hàng đầu Việt Nam, phát triển Zalo, Zing, VNG Cloud và nền tảng game toàn cầu.", "VNG Campus, Tân Thuận Đông, Quận 7, TP.HCM", "vng.png", "hr_vng@gmail.com", "Hoàng Thùy Linh (HR VNG)"),
                new CompanySeedData("FPT Software", "Tập đoàn công nghệ và xuất khẩu phần mềm số 1 Việt Nam, đối tác chiến lược của các tập đoàn Fortune 500.", "F-Town 3, Khu Công nghệ Cao, TP.Thủ Đức, TP.HCM", "fpt.png", "hr_fpt@gmail.com", "Nguyễn Thu Hà (HR FPT)"),
                new CompanySeedData("Shopee Vietnam", "Sàn thương mại điện tử hàng đầu Đông Nam Á, trực thuộc tập đoàn công nghệ Sea Group.", "Saigon Centre Tower 2, Quận 1, TP.HCM", "shopee.png", "hr_shopee@gmail.com", "Trần Minh Tuấn (HR Shopee)"),
                new CompanySeedData("MoMo (M-Service)", "Siêu ứng dụng thanh toán & tài chính số 1 Việt Nam phục vụ hơn 30 triệu người dùng.", "Tòa nhà Phú Mỹ Hưng, Quận 7, TP.HCM", "momo.png", "hr_momo@gmail.com", "Lê Phương Thảo (HR MoMo)"),
                new CompanySeedData("Viettel Solutions", "Tổng công ty Giải pháp Doanh nghiệp Viettel - Đơn vị tiên phong chuyển đổi số quốc gia.", "Tòa nhà Viettel, Cầu Giấy, Hà Nội", "viettel.png", "hr_viettel@gmail.com", "Đặng Quốc Bảo (HR Viettel)"),
                new CompanySeedData("One Mount Group", "Hệ sinh thái công nghệ số lớn nhất Việt Nam sở hữu VinShop, VinID và OneHousing.", "Times City, Hai Bà Trưng, Hà Nội", "onemount.svg", "hr_onemount@gmail.com", "Phạm Mai Chi (HR One Mount)"),
                new CompanySeedData("KMS Technology", "Công ty dịch vụ phần mềm quốc tế hàng đầu thị trường Bắc Mỹ với hơn 15 năm uy tín.", "Tân Bình, TP.HCM", "kms.svg", "hr_kms@gmail.com", "Vũ Hoàng Nam (HR KMS)"),
                new CompanySeedData("NashTech Vietnam", "Tập đoàn tư vấn giải pháp công nghệ và chuyển đổi số toàn cầu thuộc Harvey Nash Group.", "Quận 3, TP.HCM", "nashtech.svg", "hr_nashtech@gmail.com", "Đỗ Hải Đăng (HR NashTech)")
        );

        for (CompanySeedData cData : companiesToSeed) {
            Company comp = this.companyRepository.findByName(cData.name).orElseGet(() -> {
                Company c = new Company();
                c.setName(cData.name);
                c.setDescription(cData.description);
                c.setAddress(cData.address);
                c.setLogo(cData.logo);
                c.setCreatedBy("system");
                return this.companyRepository.save(c);
            });
            companyMap.put(cData.name, comp);

            // Tạo tài khoản HR gắn với công ty này
            if (!this.userRepository.existsByEmail(cData.hrEmail)) {
                User hrUser = new User();
                hrUser.setEmail(cData.hrEmail);
                hrUser.setName(cData.hrName);
                hrUser.setPassword(this.passwordEncoder.encode("123456"));
                hrUser.setAge(28);
                hrUser.setGender(GenderEnum.FEMALE);
                hrUser.setAddress(cData.address);
                hrUser.setRole(hrRole);
                hrUser.setCompany(comp);
                this.userRepository.save(hrUser);
            }
        }

        // Đảm bảo có tài khoản HR chung hr@gmail.com
        if (!this.userRepository.existsByEmail("hr@gmail.com")) {
            User hrGen = new User();
            hrGen.setEmail("hr@gmail.com");
            hrGen.setName("HR General (Shopee)");
            hrGen.setPassword(this.passwordEncoder.encode("123456"));
            hrGen.setAge(26);
            hrGen.setGender(GenderEnum.FEMALE);
            hrGen.setAddress("TP.HCM");
            hrGen.setRole(hrRole);
            hrGen.setCompany(companyMap.get("Shopee Vietnam"));
            this.userRepository.save(hrGen);
        }
        System.out.println(">>> CHECKED & INITIALIZED " + companyMap.size() + " COMPANIES & HR ACCOUNTS.");

        // 3. TẠO CÁC TÀI KHOẢN ỨNG VIÊN (CANDIDATES)
        List<CandidateSeedData> candidatesToSeed = List.of(
                new CandidateSeedData("thanhanh818757@gmail.com", "Lô Thanh Anh", 22, GenderEnum.MALE, "TP.HCM"),
                new CandidateSeedData("nam.nguyen@gmail.com", "Nguyễn Văn Nam", 25, GenderEnum.MALE, "Hà Nội"),
                new CandidateSeedData("mai.tran@gmail.com", "Trần Thị Mai", 24, GenderEnum.FEMALE, "Đà Nẵng"),
                new CandidateSeedData("long.le@gmail.com", "Lê Hoàng Long", 27, GenderEnum.MALE, "TP.HCM"),
                new CandidateSeedData("duc.pham@gmail.com", "Phạm Minh Đức", 26, GenderEnum.MALE, "Hà Nội"),
                new CandidateSeedData("trang.vu@gmail.com", "Vũ Thu Trang", 23, GenderEnum.FEMALE, "TP.HCM"),
                new CandidateSeedData("kiet.do@gmail.com", "Đỗ Tuấn Kiệt", 28, GenderEnum.MALE, "TP.HCM"),
                new CandidateSeedData("ngoc.hoang@gmail.com", "Hoàng Bảo Ngọc", 24, GenderEnum.FEMALE, "Hà Nội"),
                new CandidateSeedData("son.bui@gmail.com", "Bùi Thanh Sơn", 29, GenderEnum.MALE, "Đà Nẵng"),
                new CandidateSeedData("vy.dinh@gmail.com", "Đinh Thảo Vy", 25, GenderEnum.FEMALE, "TP.HCM")
        );

        Map<String, User> candidateMap = new HashMap<>();
        for (CandidateSeedData cand : candidatesToSeed) {
            User user = this.userRepository.findByEmail(cand.email).orElseGet(() -> {
                User u = new User();
                u.setEmail(cand.email);
                u.setName(cand.name);
                u.setPassword(this.passwordEncoder.encode("123456"));
                u.setAge(cand.age);
                u.setGender(cand.gender);
                u.setAddress(cand.address);
                u.setRole(userRole);
                return this.userRepository.save(u);
            });
            candidateMap.put(cand.email, user);
        }
        System.out.println(">>> CHECKED & INITIALIZED " + candidateMap.size() + " CANDIDATE USERS.");

        // 4. TẠO CÁC TIN TUYỂN DỤNG HẤP DẪN (JOBS)
        Map<String, Job> jobMap = new HashMap<>();
        List<JobSeedData> jobsToSeed = List.of(
                new JobSeedData(
                        "Senior Java Backend Engineer (Spring Cloud / Microservices)",
                        "VNG Corporation",
                        "TP.HCM",
                        45000000,
                        3,
                        LevelEnum.SENIOR,
                        "Thiết kế và phát triển các hệ thống Microservices quy mô lớn phục vụ hàng triệu người dùng tại VNG. Yêu cầu thành thạo Java 21, Spring Boot, Spring Cloud, Apache Kafka, Redis, Docker/K8s và tối ưu hóa truy vấn Database.",
                        List.of("Java", "Spring Boot", "Spring Cloud", "Kafka", "Redis", "Docker", "Microservices")
                ),
                new JobSeedData(
                        "Lead ReactJS / Next.js Frontend Developer",
                        "VNG Corporation",
                        "TP.HCM",
                        40000000,
                        2,
                        LevelEnum.SENIOR,
                        "Xây dựng kiến trúc giao diện Web Portal hiệu năng cao với React 18, Next.js, TypeScript. Yêu cầu kinh nghiệm tối ưu hóa Core Web Vitals, SSR/SSG, State Management với Redux Toolkit / Zustand.",
                        List.of("ReactJS", "NextJS", "TypeScript", "JavaScript", "Microservices")
                ),
                new JobSeedData(
                        "Junior Java / Spring Boot Developer",
                        "FPT Software",
                        "Hà Nội",
                        18000000,
                        5,
                        LevelEnum.JUNIOR,
                        "Tham gia các dự án phát triển phần mềm cho đối tác Nhật Bản & Mỹ. Yêu cầu nắm vững OOP, Spring Boot REST API, Hibernate/JPA, MySQL và có tinh thần ham học hỏi, trách nhiệm cao.",
                        List.of("Java", "Spring Boot", "MySQL", "CI/CD")
                ),
                new JobSeedData(
                        "Middle Fullstack Developer (React & Node.js)",
                        "FPT Software",
                        "Đà Nẵng",
                        28000000,
                        4,
                        LevelEnum.MIDDLE,
                        "Phát triển ứng dụng Web toàn diện từ Frontend (React/TypeScript) đến Backend (Node.js/NestJS, PostgreSQL). Yêu cầu kinh nghiệm viết Clean Code, Unit Test và làm việc theo mô hình Agile/Scrum.",
                        List.of("ReactJS", "Node.js", "NestJS", "TypeScript", "PostgreSQL")
                ),
                new JobSeedData(
                        "DevOps & Cloud AWS Engineer",
                        "Shopee Vietnam",
                        "TP.HCM",
                        50000000,
                        2,
                        LevelEnum.SENIOR,
                        "Thiết lập và tự động hóa hệ thống CI/CD, quản trị hạ tầng Cloud AWS quy mô lớn, giám sát Kubernetes (EKS), tối ưu chi phí hạ tầng và đảm bảo High Availability 99.99%.",
                        List.of("Docker", "Kubernetes", "AWS", "CI/CD", "Python")
                ),
                new JobSeedData(
                        "Senior Golang Backend Engineer (High Concurrency)",
                        "Shopee Vietnam",
                        "TP.HCM",
                        55000000,
                        3,
                        LevelEnum.SENIOR,
                        "Phát triển lõi dịch vụ xử lý thanh toán và khuyến mại thời gian thực với lượng truy cập cực lớn trong các đợt Siêu Sale. Yêu cầu kinh nghiệm Go Concurrency (Goroutines/Channels), Redis, Kafka.",
                        List.of("Golang", "Redis", "Kafka", "MySQL", "Microservices", "System Design")
                ),
                new JobSeedData(
                        "Mobile Flutter Developer (iOS & Android)",
                        "MoMo (M-Service)",
                        "TP.HCM",
                        32000000,
                        3,
                        LevelEnum.MIDDLE,
                        "Phát triển các mini-app và tính năng thanh toán tài chính trên Siêu ứng dụng MoMo bằng Flutter. Yêu cầu thành thạo Clean Architecture, Bloc/Riverpod, tối ưu bộ nhớ và Animation mượt mà.",
                        List.of("Flutter", "TypeScript", "MySQL", "Redis")
                ),
                new JobSeedData(
                        "Senior Data Engineer & AI Specialist (PySpark / Airflow)",
                        "MoMo (M-Service)",
                        "TP.HCM",
                        52000000,
                        2,
                        LevelEnum.SENIOR,
                        "Xây dựng Big Data Pipeline xử lý dữ liệu giao dịch hàng ngày, tích hợp mô hình Machine Learning phát hiện gian lận thanh toán. Yêu cầu PySpark, Apache Airflow, Data Lakehouse.",
                        List.of("Python", "MySQL", "PostgreSQL", "Kafka")
                ),
                new JobSeedData(
                        "Core Banking Java Software Engineer",
                        "Viettel Solutions",
                        "Hà Nội",
                        48000000,
                        4,
                        LevelEnum.SENIOR,
                        "Phát triển giải pháp tài chính và ngân hàng số cho các ngân hàng và tổ chức chính phủ. Yêu cầu chuyên sâu Java Core, Spring Boot, Oracle/PostgreSQL, bảo mật hệ thống và kiến trúc phân tán.",
                        List.of("Java", "Spring Boot", "PostgreSQL", "Microservices", "System Design")
                ),
                new JobSeedData(
                        "Solution Architect (Cloud Native & Enterprise)",
                        "Viettel Solutions",
                        "Hà Nội",
                        75000000,
                        1,
                        LevelEnum.SENIOR,
                        "Chịu trách nhiệm thiết kế kiến trúc kỹ thuật tổng thể cho các siêu dự án cấp quốc gia. Định hướng công nghệ Cloud Native, Microservices, Security, tư vấn giải pháp cho khách hàng lớn.",
                        List.of("System Design", "AWS", "Kubernetes", "Java", "Golang", "Microservices")
                ),
                new JobSeedData(
                        "Frontend Fresher React / Vue Developer",
                        "One Mount Group",
                        "Hà Nội",
                        12000000,
                        6,
                        LevelEnum.FRESHER,
                        "Được đào tạo bài bản bởi các Tech Lead hàng đầu. Tham gia phát triển giao diện hệ thống VinID / OneHousing. Yêu cầu tư duy lập trình tốt, nắm chắc JavaScript ES6+, HTML5/CSS3.",
                        List.of("ReactJS", "JavaScript", "TypeScript")
                ),
                new JobSeedData(
                        "QA Automation Engineer (Java / Selenium / Cypress)",
                        "KMS Technology",
                        "TP.HCM",
                        28000000,
                        3,
                        LevelEnum.MIDDLE,
                        "Xây dựng Automation Test Framework cho các dự án phần mềm y tế và tài chính Bắc Mỹ. Yêu cầu thành thạo Selenium/Cypress, Java/TypeScript, CI/CD và Performance Testing.",
                        List.of("QA Testing", "Java", "TypeScript", "CI/CD")
                ),
                new JobSeedData(
                        "Cloud Infrastructure & Security Engineer",
                        "NashTech Vietnam",
                        "TP.HCM",
                        42000000,
                        2,
                        LevelEnum.SENIOR,
                        "Thiết kế và triển khai kiến trúc Cloud AWS/Azure an toàn, cấu hình WAF, tuân thủ tiêu chuẩn bảo mật quốc tế ISO 27001 và SOC2.",
                        List.of("AWS", "Docker", "Kubernetes", "CI/CD")
                ),
                new JobSeedData(
                        "Backend Node.js / NestJS Middle Engineer",
                        "VNG Corporation",
                        "TP.HCM",
                        30000000,
                        3,
                        LevelEnum.MIDDLE,
                        "Xây dựng hệ thống Backend API cho các dịch vụ mạng xã hội và giải trí. Yêu cầu thành thạo TypeScript, NestJS, MongoDB, Redis Caching và Message Queue.",
                        List.of("Node.js", "NestJS", "TypeScript", "MongoDB", "Redis")
                )
        );

        for (JobSeedData jData : jobsToSeed) {
            Job job = this.jobRepository.findByName(jData.name).orElseGet(() -> {
                Job j = new Job();
                j.setName(jData.name);
                j.setLocation(jData.location);
                j.setSalary(jData.salary);
                j.setQuantity(jData.quantity);
                j.setLevel(jData.level);
                j.setDescription(jData.description);
                j.setCompany(companyMap.get(jData.companyName));
                j.setActive(true);
                j.setStartDate(Instant.now().minus(10, ChronoUnit.DAYS));
                j.setEndDate(Instant.now().plus(60, ChronoUnit.DAYS));
                j.setCreatedBy("system");

                List<Skill> jSkills = new ArrayList<>();
                for (String skName : jData.skillNames) {
                    if (skillMap.containsKey(skName)) {
                        jSkills.add(skillMap.get(skName));
                    }
                }
                j.setSkills(jSkills);

                return this.jobRepository.save(j);
            });
            jobMap.put(jData.name, job);
        }
        System.out.println(">>> CHECKED & INITIALIZED " + jobMap.size() + " IT JOBS.");

        // 5. TẠO CÁC HỒ SƠ ỨNG TUYỂN (RESUMES / APPLICATIONS)
        if (this.resumeRepository.count() < 10) {
            String samplePdf = "1782945950047-Lo-Thanh-Anh-CV-Backend.pdf";
            String sampleDocx = "1782944975055-Lo-Thanh-Anh-CV-Java-Backend.docx";

            List<ResumeSeedData> resumesToSeed = List.of(
                    new ResumeSeedData("thanhanh818757@gmail.com", "Senior Java Backend Engineer (Spring Cloud / Microservices)", samplePdf, ResumeStateEnum.APPROVED),
                    new ResumeSeedData("thanhanh818757@gmail.com", "Lead ReactJS / Next.js Frontend Developer", sampleDocx, ResumeStateEnum.REVIEWING),
                    new ResumeSeedData("nam.nguyen@gmail.com", "DevOps & Cloud AWS Engineer", samplePdf, ResumeStateEnum.APPROVED),
                    new ResumeSeedData("nam.nguyen@gmail.com", "Cloud Infrastructure & Security Engineer", samplePdf, ResumeStateEnum.PENDING),
                    new ResumeSeedData("mai.tran@gmail.com", "Junior Java / Spring Boot Developer", sampleDocx, ResumeStateEnum.APPROVED),
                    new ResumeSeedData("mai.tran@gmail.com", "Middle Fullstack Developer (React & Node.js)", samplePdf, ResumeStateEnum.REVIEWING),
                    new ResumeSeedData("long.le@gmail.com", "Senior Golang Backend Engineer (High Concurrency)", samplePdf, ResumeStateEnum.APPROVED),
                    new ResumeSeedData("long.le@gmail.com", "Senior Java Backend Engineer (Spring Cloud / Microservices)", sampleDocx, ResumeStateEnum.REVIEWING),
                    new ResumeSeedData("duc.pham@gmail.com", "Core Banking Java Software Engineer", samplePdf, ResumeStateEnum.APPROVED),
                    new ResumeSeedData("duc.pham@gmail.com", "Junior Java / Spring Boot Developer", sampleDocx, ResumeStateEnum.PENDING),
                    new ResumeSeedData("trang.vu@gmail.com", "Mobile Flutter Developer (iOS & Android)", samplePdf, ResumeStateEnum.APPROVED),
                    new ResumeSeedData("trang.vu@gmail.com", "Frontend Fresher React / Vue Developer", sampleDocx, ResumeStateEnum.PENDING),
                    new ResumeSeedData("kiet.do@gmail.com", "Senior Data Engineer & AI Specialist (PySpark / Airflow)", samplePdf, ResumeStateEnum.APPROVED),
                    new ResumeSeedData("kiet.do@gmail.com", "Backend Node.js / NestJS Middle Engineer", sampleDocx, ResumeStateEnum.REVIEWING),
                    new ResumeSeedData("ngoc.hoang@gmail.com", "QA Automation Engineer (Java / Selenium / Cypress)", samplePdf, ResumeStateEnum.REVIEWING),
                    new ResumeSeedData("son.bui@gmail.com", "Solution Architect (Cloud Native & Enterprise)", samplePdf, ResumeStateEnum.PENDING),
                    new ResumeSeedData("son.bui@gmail.com", "DevOps & Cloud AWS Engineer", sampleDocx, ResumeStateEnum.REJECTED),
                    new ResumeSeedData("vy.dinh@gmail.com", "Frontend Fresher React / Vue Developer", samplePdf, ResumeStateEnum.APPROVED),
                    new ResumeSeedData("vy.dinh@gmail.com", "Lead ReactJS / Next.js Frontend Developer", sampleDocx, ResumeStateEnum.REJECTED)
            );

            for (ResumeSeedData rData : resumesToSeed) {
                User user = candidateMap.get(rData.candidateEmail);
                Job job = jobMap.get(rData.jobName);
                if (user != null && job != null) {
                    Resume r = new Resume();
                    r.setEmail(user.getEmail());
                    r.setUrl(rData.url);
                    r.setStatus(rData.status);
                    r.setUser(user);
                    r.setJob(job);
                    r.setCreatedBy(user.getEmail());
                    this.resumeRepository.save(r);
                }
            }
            System.out.println(">>> SEEDED " + resumesToSeed.size() + " CANDIDATE RESUMES / APPLICATIONS.");
        }

        // 6. TẠO LỊCH PHỎNG VẤN MẪU (INTERVIEW SCHEDULES)
        if (this.interviewScheduleRepository.count() < 5) {
            List<InterviewSeedData> interviewsToSeed = List.of(
                    new InterviewSeedData(
                            "Phỏng vấn Vòng Kỹ Thuật (Technical Round) - VNG",
                            Instant.now().plus(2, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS),
                            "Online qua Google Meet (https://meet.google.com/abc-xyz-vng)",
                            InterviewStateEnum.ACCEPTED,
                            "Em đã nhận được thông tin và xác nhận tham gia đúng giờ qua link Google Meet. Em cảm ơn quý công ty.",
                            "thanhanh818757@gmail.com",
                            "Senior Java Backend Engineer (Spring Cloud / Microservices)"
                    ),
                    new InterviewSeedData(
                            "Phỏng vấn Trực Tiếp tại Văn Phòng VNG Campus",
                            Instant.now().plus(4, ChronoUnit.DAYS).plus(2, ChronoUnit.HOURS),
                            "Phòng họp Star 3, Tầng 4, VNG Campus, Quận 7, TP.HCM",
                            InterviewStateEnum.SCHEDULED,
                            null,
                            "thanhanh818757@gmail.com",
                            "Lead ReactJS / Next.js Frontend Developer"
                    ),
                    new InterviewSeedData(
                            "Phỏng vấn System Architecture & Live Coding - Shopee",
                            Instant.now().plus(3, ChronoUnit.DAYS),
                            "Online qua Zoom Meeting (ID: 889 1234 5678 - Pass: 123456)",
                            InterviewStateEnum.ACCEPTED,
                            "Tôi đã sẵn sàng tham gia phỏng vấn.",
                            "nam.nguyen@gmail.com",
                            "DevOps & Cloud AWS Engineer"
                    ),
                    new InterviewSeedData(
                            "Phỏng vấn Kỹ Năng Lập Trình & Tư Duy Giải Thuật - FPT",
                            Instant.now().plus(1, ChronoUnit.DAYS).plus(3, ChronoUnit.HOURS),
                            "Online qua Microsoft Teams",
                            InterviewStateEnum.ACCEPTED,
                            "Dạ em đã chuẩn bị môi trường code và sẵn sàng phỏng vấn ạ.",
                            "mai.tran@gmail.com",
                            "Junior Java / Spring Boot Developer"
                    ),
                    new InterviewSeedData(
                            "Phỏng vấn Mobile Architecture & Performance - MoMo",
                            Instant.now().minus(2, ChronoUnit.DAYS),
                            "Tòa nhà Phú Mỹ Hưng, Quận 7, TP.HCM",
                            InterviewStateEnum.COMPLETED,
                            "Đã hoàn thành xuất sắc vòng phỏng vấn kỹ thuật.",
                            "trang.vu@gmail.com",
                            "Mobile Flutter Developer (iOS & Android)"
                    ),
                    new InterviewSeedData(
                            "Phỏng vấn Big Data & AI Model - MoMo",
                            Instant.now().plus(5, ChronoUnit.DAYS),
                            "Online qua Google Meet (https://meet.google.com/momo-data-tech)",
                            InterviewStateEnum.SCHEDULED,
                            null,
                            "kiet.do@gmail.com",
                            "Senior Data Engineer & AI Specialist (PySpark / Airflow)"
                    )
            );

            for (InterviewSeedData iData : interviewsToSeed) {
                User cand = candidateMap.get(iData.candidateEmail);
                Job job = jobMap.get(iData.jobName);
                if (cand != null && job != null) {
                    InterviewSchedule interview = new InterviewSchedule();
                    interview.setTitle(iData.title);
                    interview.setInterviewTime(iData.interviewTime);
                    interview.setLocation(iData.location);
                    interview.setStatus(iData.status);
                    interview.setCandidateNote(iData.candidateNote);
                    interview.setCandidate(cand);
                    interview.setJob(job);
                    interview.setCreatedBy("hr_system");
                    this.interviewScheduleRepository.save(interview);
                }
            }
            System.out.println(">>> SEEDED " + interviewsToSeed.size() + " INTERVIEW SCHEDULES.");
        }

        // 7. TẠO CUỘC TRÒ CHUYỆN & TIN NHẮN CHAT MẪU (LIVE CHAT)
        if (this.conversationRepository.count() == 0) {
            User candThanhAnh = candidateMap.get("thanhanh818757@gmail.com");
            User hrVng = this.userRepository.findByEmail("hr_vng@gmail.com").orElse(null);
            Company vngCompany = companyMap.get("VNG Corporation");
            Job jobJavaVng = jobMap.get("Senior Java Backend Engineer (Spring Cloud / Microservices)");

            if (candThanhAnh != null && hrVng != null && vngCompany != null && jobJavaVng != null) {
                Conversation conv = new Conversation();
                conv.setCandidate(candThanhAnh);
                conv.setCompany(vngCompany);
                conv.setJob(jobJavaVng);
                conv.setLastMessage("Dạ em đã nhận được lịch và bấm xác nhận tham gia rồi ạ. Cảm ơn chị nhiều!");
                conv.setLastMessageAt(Instant.now());
                conv.setLastSender(candThanhAnh);
                conv.setUnreadCandidate(0);
                conv.setUnreadHr(0);
                conv.setCreatedBy(candThanhAnh.getEmail());
                Conversation savedConv = this.conversationRepository.save(conv);

                // Thêm các tin nhắn mẫu
                ChatMessage m1 = ChatMessage.builder()
                        .conversation(savedConv)
                        .sender(candThanhAnh)
                        .content("Chào chị Thùy Linh, em đã nộp hồ sơ ứng tuyển vị trí Senior Java Backend tại VNG ạ.")
                        .isRead(true)
                        .createdAt(Instant.now().minus(3, ChronoUnit.HOURS))
                        .build();

                ChatMessage m2 = ChatMessage.builder()
                        .conversation(savedConv)
                        .sender(hrVng)
                        .content("Chào Thanh Anh, chị đã nhận được CV của em. Hồ sơ của em rất ấn tượng về kinh nghiệm Spring Boot và Microservices!")
                        .isRead(true)
                        .createdAt(Instant.now().minus(2, ChronoUnit.HOURS))
                        .build();

                ChatMessage m3 = ChatMessage.builder()
                        .conversation(savedConv)
                        .sender(hrVng)
                        .content("Chị vừa gửi lịch hẹn phỏng vấn kỹ thuật vào 14:30 thứ Năm tuần này qua Google Meet, em check xác nhận nhé.")
                        .isRead(true)
                        .createdAt(Instant.now().minus(1, ChronoUnit.HOURS))
                        .build();

                ChatMessage m4 = ChatMessage.builder()
                        .conversation(savedConv)
                        .sender(candThanhAnh)
                        .content("Dạ em đã nhận được lịch và bấm xác nhận tham gia rồi ạ. Cảm ơn chị nhiều!")
                        .isRead(true)
                        .createdAt(Instant.now().minus(20, ChronoUnit.MINUTES))
                        .build();

                this.chatMessageRepository.saveAll(List.of(m1, m2, m3, m4));
                System.out.println(">>> SEEDED SAMPLE LIVE CHAT CONVERSATION & MESSAGES.");
            }
        }

        // 8. TẠO THÔNG BÁO QUẢ CHUÔNG (NOTIFICATIONS)
        if (this.notificationRepository.count() == 0) {
            User candThanhAnh = candidateMap.get("thanhanh818757@gmail.com");
            if (candThanhAnh != null) {
                Notification n1 = new Notification();
                n1.setUser(candThanhAnh);
                n1.setMessage("Công ty VNG Corporation đã cập nhật trạng thái hồ sơ của bạn thành: ĐẠT YÊU CẦU (APPROVED)");
                n1.setRead(false);
                n1.setCreatedAt(Instant.now().minus(2, ChronoUnit.HOURS));

                Notification n2 = new Notification();
                n2.setUser(candThanhAnh);
                n2.setMessage("Bạn có 1 lịch phỏng vấn mới từ VNG Corporation vào lúc 14:30 ngày 19/09/2026.");
                n2.setRead(false);
                n2.setCreatedAt(Instant.now().minus(1, ChronoUnit.HOURS));

                Notification n3 = new Notification();
                n3.setUser(candThanhAnh);
                n3.setMessage("Hệ thống gợi ý: Có 3 công việc mới phù hợp với kỹ năng Java, Spring Boot của bạn!");
                n3.setRead(true);
                n3.setCreatedAt(Instant.now().minus(1, ChronoUnit.DAYS));

                this.notificationRepository.saveAll(List.of(n1, n2, n3));
                System.out.println(">>> SEEDED SAMPLE NOTIFICATIONS.");
            }
        }
    }

    private void initDefaultSiteSettings() {
        initSingleSetting("FOOTER_INFO", "{\n" +
                "  \"about\": \"Nền tảng kết nối cơ hội việc làm công nghệ thông tin hàng đầu Việt Nam. Giúp các nhà phát triển tài năng tìm kiếm bến đỗ mơ ước và hỗ trợ doanh nghiệp xây dựng đội ngũ công nghệ vững mạnh.\",\n" +
                "  \"address\": \"97 Man Thiện, Thủ Đức, TP.HCM\",\n" +
                "  \"phone\": \"+84 358 988 590\",\n" +
                "  \"email\": \"thanhanh982004@gmail.com\",\n" +
                "  \"facebook\": \"https://facebook.com\",\n" +
                "  \"twitter\": \"https://twitter.com\",\n" +
                "  \"linkedin\": \"https://linkedin.com\",\n" +
                "  \"github\": \"https://github.com\",\n" +
                "  \"copyright\": \"© 2026 JobHunter. All rights reserved. Designed by Thanh Anh.\"\n" +
                "}", "Thông tin liên hệ & bản quyền chân trang Footer");

        initSingleSetting("PAGE_ABOUT", "{\n" +
                "  \"title\": \"Về Chúng Tôi - JobHunter\",\n" +
                "  \"subtitle\": \"Cầu nối vững chắc giữa nhân tài công nghệ và doanh nghiệp hàng đầu\",\n" +
                "  \"story\": \"JobHunter được thành lập với sứ mệnh giải quyết bài toán tuyển dụng trong ngành CNTT tại Việt Nam. Chúng tôi tin rằng mỗi lập trình viên đều xứng đáng có một môi trường để bứt phá tiềm năng, và mỗi doanh nghiệp đều xứng đáng sở hữu những chiến binh công nghệ xuất sắc nhất.\",\n" +
                "  \"mission\": \"Xây dựng hệ sinh thái tuyển dụng thông minh, minh bạch và hiệu quả nhất cho cộng đồng công nghệ thông tin.\",\n" +
                "  \"vision\": \"Trở thành nền tảng việc làm IT số 1 tại Đông Nam Á, nơi mọi cơ hội nghề nghiệp đều được cá nhân hóa bằng công nghệ hiện đại.\",\n" +
                "  \"values\": [\"Minh bạch & Tận tâm\", \"Đổi mới sáng tạo\", \"Đồng hành cùng phát triển\", \"Bảo mật & Tôn trọng\"]\n" +
                "}", "Nội dung trang Về chúng tôi (About Us)");

        initSingleSetting("PAGE_TERMS", "{\n" +
                "  \"title\": \"Điều Khoản Dịch Vụ\",\n" +
                "  \"updatedAt\": \"16-09-2026\",\n" +
                "  \"sections\": [\n" +
                "    {\"heading\": \"1. Chấp thuận điều khoản\", \"content\": \"Bằng việc truy cập và sử dụng dịch vụ trên nền tảng JobHunter, bạn đồng ý tuân thủ toàn bộ các điều khoản và điều kiện được nêu tại đây.\"},\n" +
                "    {\"heading\": \"2. Tài khoản người dùng\", \"content\": \"Người dùng chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Mọi hoạt động phát sinh dưới tài khoản của bạn sẽ thuộc trách nhiệm cá nhân của bạn.\"},\n" +
                "    {\"heading\": \"3. Quy định dành cho Nhà tuyển dụng\", \"content\": \"Tin tuyển dụng đăng tải phải chính xác, không vi phạm pháp luật và không có nội dung phân biệt đối xử hay gian lận tuyển dụng.\"},\n" +
                "    {\"heading\": \"4. Quy định dành cho Ứng viên\", \"content\": \"Hồ sơ ứng tuyển và CV gửi qua hệ thống phải phản ánh trung thực năng lực và kinh nghiệm làm việc thực tế.\"},\n" +
                "    {\"heading\": \"5. Quyền sở hữu trí tuệ\", \"content\": \"Mọi thương hiệu, biểu trưng và nội dung thuộc sở hữu của JobHunter hoặc bên cấp phép đều được bảo vệ bởi luật sở hữu trí tuệ.\"}\n" +
                "  ]\n" +
                "}", "Nội dung trang Điều khoản dịch vụ (Terms of Service)");

        initSingleSetting("PAGE_PRIVACY", "{\n" +
                "  \"title\": \"Chính Sách Bảo Mật\",\n" +
                "  \"updatedAt\": \"16-09-2026\",\n" +
                "  \"sections\": [\n" +
                "    {\"heading\": \"1. Thông tin chúng tôi thu thập\", \"content\": \"Chúng tôi chỉ thu thập các thông tin cần thiết như họ tên, email, số điện thoại, kinh nghiệm làm việc và CV để phục vụ mục đích kết nối tuyển dụng.\"},\n" +
                "    {\"heading\": \"2. Mục đích sử dụng thông tin\", \"content\": \"Thông tin của bạn được sử dụng để kết nối ứng viên với nhà tuyển dụng phù hợp, gửi thông báo lịch phỏng vấn và cải thiện trải nghiệm người dùng.\"},\n" +
                "    {\"heading\": \"3. Bảo vệ dữ liệu cá nhân\", \"content\": \"JobHunter áp dụng các tiêu chuẩn bảo mật mã hóa SSL/TLS hiện đại và xác thực JWT để đảm bảo thông tin cá nhân của bạn luôn được an toàn tuyệt đối.\"},\n" +
                "    {\"heading\": \"4. Chia sẻ dữ liệu với bên thứ ba\", \"content\": \"Chúng tôi cam kết không bán, trao đổi hoặc tiết lộ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào ngoại trừ các nhà tuyển dụng mà bạn đã chủ động nộp hồ sơ.\"}\n" +
                "  ]\n" +
                "}", "Nội dung trang Chính sách bảo mật (Privacy Policy)");

        initSingleSetting("PAGE_FAQ", "{\n" +
                "  \"title\": \"Câu Hỏi Thường Gặp (FAQ)\",\n" +
                "  \"subtitle\": \"Giải đáp nhanh các thắc mắc phổ biến của ứng viên và nhà tuyển dụng\",\n" +
                "  \"faqs\": [\n" +
                "    {\"category\": \"Dành cho Ứng viên\", \"question\": \"Làm thế nào để ứng tuyển vào một vị trí trên JobHunter?\", \"answer\": \"Bạn chỉ cần đăng nhập tài khoản, tìm kiếm công việc phù hợp và bấm nút 'Nộp CV' để tải lên hồ sơ của mình.\"},\n" +
                "    {\"category\": \"Dành cho Ứng viên\", \"question\": \"Tôi có thể nhắn tin trực tiếp với Nhà tuyển dụng không?\", \"answer\": \"Có, JobHunter hỗ trợ tính năng chat trực tiếp real-time với HR ngay trên trang tin tuyển dụng hoặc trang chi tiết công ty.\"},\n" +
                "    {\"category\": \"Dành cho Ứng viên\", \"question\": \"Làm sao để biết khi nào có lịch phỏng vấn?\", \"answer\": \"Hệ thống sẽ gửi thông báo real-time lên icon quả chuông, gửi email thông báo chi tiết và cập nhật trong mục 'Lịch phỏng vấn' ở trang tài khoản.\"},\n" +
                "    {\"category\": \"Dành cho Nhà tuyển dụng\", \"question\": \"Làm thế nào để đặt lịch phỏng vấn cho ứng viên?\", \"answer\": \"Tại trang Quản lý hồ sơ ứng viên (CV), bạn bấm vào icon lịch 'Đặt lịch phỏng vấn' tại hồ sơ mong muốn, chọn ngày giờ và gửi lời mời đến ứng viên.\"},\n" +
                "    {\"category\": \"Dành cho Nhà tuyển dụng\", \"question\": \"Tôi có thể chỉnh sửa thông tin công ty sau khi tạo không?\", \"answer\": \"Hoàn toàn được, HR có thể vào mục 'Hồ sơ doanh nghiệp' để cập nhật mô tả, logo, địa chỉ và quy mô bất kỳ lúc nào.\"}\n" +
                "  ]\n" +
                "}", "Nội dung trang Câu hỏi thường gặp (FAQ)");
    }

    private void initSingleSetting(String key, String value, String desc) {
        if (!this.siteSettingRepository.existsByKeyName(key)) {
            SiteSetting setting = new SiteSetting();
            setting.setKeyName(key);
            setting.setValue(value);
            setting.setDescription(desc);
            setting.setUpdatedBy("system");
            this.siteSettingRepository.save(setting);
            System.out.println(">>> INITIALIZED DEFAULT SITE SETTING: " + key);
        }
    }

    // Helper classes for clean data seeding
    private record CompanySeedData(String name, String description, String address, String logo, String hrEmail, String hrName) {}
    private record CandidateSeedData(String email, String name, int age, GenderEnum gender, String address) {}
    private record JobSeedData(String name, String companyName, String location, double salary, int quantity, LevelEnum level, String description, List<String> skillNames) {}
    private record ResumeSeedData(String candidateEmail, String jobName, String url, ResumeStateEnum status) {}
    private record InterviewSeedData(String title, Instant interviewTime, String location, InterviewStateEnum status, String candidateNote, String candidateEmail, String jobName) {}
}
