package thanhanh.job_recruitment.config;

import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import thanhanh.job_recruitment.domain.Permission;
import thanhanh.job_recruitment.domain.Role;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.repository.PermissionRepository;
import thanhanh.job_recruitment.repository.RoleRepository;
import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.util.constant.GenderEnum;

import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final thanhanh.job_recruitment.repository.SiteSettingRepository siteSettingRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println(">>> START INIT DATABASE");
        long countPermissions = this.permissionRepository.count();
        long countRoles = this.roleRepository.count();
        long countUsers = this.userRepository.count();

        if (countPermissions == 0) {
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

        // Tự động kiểm tra và thêm các quyền hạn còn thiếu cho module CHATS và INTERVIEWS
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

        initDefaultSiteSettings();

        if (countRoles == 0) {
            List<Permission> allPermissions = this.permissionRepository.findAll();

            Role adminRole = new Role();
            adminRole.setName("SUPER_ADMIN");
            adminRole.setDescription("Admin thì full permissions");
            adminRole.setActive(true);
            adminRole.setPermissions(allPermissions);

            this.roleRepository.save(adminRole);

            // Tạo luôn HR role với các quyền cần thiết
            List<Permission> hrPerms = allPermissions.stream()
                    .filter(p -> "CHATS".equals(p.getModule())
                            || "JOBS".equals(p.getModule())
                            || "RESUMES".equals(p.getModule())
                            || "INTERVIEWS".equals(p.getModule())
                            || "FILES".equals(p.getModule())
                            || ("COMPANIES".equals(p.getModule()) && !"DELETE".equals(p.getMethod()))
                    )
                    .toList();
            Role hrRole = new Role();
            hrRole.setName("HR");
            hrRole.setDescription("HR representative for company");
            hrRole.setActive(true);
            hrRole.setPermissions(new ArrayList<>(hrPerms));
            this.roleRepository.save(hrRole);
        } else {
            // Cập nhật SUPER_ADMIN role luôn có tất cả permissions mới nhất
            Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
            if (adminRole != null) {
                List<Permission> allPermissions = this.permissionRepository.findAll();
                adminRole.setPermissions(allPermissions);
                this.roleRepository.save(adminRole);
            }

            // Đảm bảo HR role có quyền CHATS và các quyền liên quan
            Role hrRole = this.roleRepository.findByName("HR");
            if (hrRole != null) {
                List<Permission> allPerms = this.permissionRepository.findAll();
                List<Permission> hrPerms = allPerms.stream()
                        .filter(p -> "CHATS".equals(p.getModule())
                                || "JOBS".equals(p.getModule())
                                || "RESUMES".equals(p.getModule())
                                || "INTERVIEWS".equals(p.getModule())
                                || "FILES".equals(p.getModule())
                                || ("COMPANIES".equals(p.getModule()) && !"DELETE".equals(p.getMethod()))
                        )
                        .toList();
                List<Permission> currentHrPerms = hrRole.getPermissions();
                if (currentHrPerms == null) {
                    currentHrPerms = new ArrayList<>();
                }
                boolean updated = false;
                for (Permission p : hrPerms) {
                    if (currentHrPerms.stream().noneMatch(existing -> existing.getId() == p.getId())) {
                        currentHrPerms.add(p);
                        updated = true;
                    }
                }
                if (updated) {
                    hrRole.setPermissions(currentHrPerms);
                    this.roleRepository.save(hrRole);
                    System.out.println(">>> UPDATED HR ROLE WITH CHATS & MISSING PERMISSIONS");
                }
            }
        }

        if (countUsers == 0) {
            User adminUser = new User();
            adminUser.setEmail("admin@gmail.com");
            adminUser.setAddress("hn");
            adminUser.setAge(25);
            adminUser.setGender(GenderEnum.MALE);
            adminUser.setName("I'm super admin");
            adminUser.setPassword(this.passwordEncoder.encode("123456"));

            Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
            if (adminRole != null) {
                adminUser.setRole(adminRole);
            }

            this.userRepository.save(adminUser);
        }

        System.out.println(">>> END INIT DATABASE");
    }

    private void initMissingPermission(String name, String apiPath, String method, String module) {
        boolean exists = this.permissionRepository.existsByApiPathAndMethod(apiPath, method);
        if (!exists) {
            Permission p = new Permission(name, apiPath, method, module);
            this.permissionRepository.save(p);
            System.out.println(">>> ADDED MISSING PERMISSION: " + name + " [" + method + " " + apiPath + "]");
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
            thanhanh.job_recruitment.domain.SiteSetting setting = new thanhanh.job_recruitment.domain.SiteSetting();
            setting.setKeyName(key);
            setting.setValue(value);
            setting.setDescription(desc);
            setting.setUpdatedBy("system");
            this.siteSettingRepository.save(setting);
            System.out.println(">>> INITIALIZED DEFAULT SITE SETTING: " + key);
        }
    }
}
