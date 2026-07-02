package thanhanh.job_recruitment.config;

import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerMapping;
import thanhanh.job_recruitment.domain.Permission;
import thanhanh.job_recruitment.domain.Role;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.service.UserService;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.exception.PermissionException;


public class PermissionInterceptor implements HandlerInterceptor {
    @Autowired
    UserService userService;

    @Transactional
    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws Exception {
        String path = (String) request.getAttribute(
                HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE
        );
        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();
        System.out.println(">>> RUN preHandle");
        System.out.println(">>> path= " + path);
        System.out.println(">>> httpMethod= " + httpMethod);
        System.out.println(">>> requestURI= " + requestURI);

        // check permission
        if (httpMethod.equals("GET") && (
                path.startsWith("/api/v1/companies") ||
                path.startsWith("/api/v1/jobs") ||
                path.startsWith("/api/v1/skills")
        )) {
            return true;
        }

        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        // Cho phép người dùng tự lấy thông tin cá nhân của mình
        if (httpMethod.equals("GET") && "/api/v1/users/{id}".equals(path)) {
            @SuppressWarnings("unchecked")
            java.util.Map<String, String> pathVariables = (java.util.Map<String, String>) request
                    .getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
            if (pathVariables != null && pathVariables.containsKey("id")) {
                try {
                    long id = Long.parseLong(pathVariables.get("id"));
                    User currentUser = this.userService.fetchUserByEmail(email);
                    if (currentUser != null && currentUser.getId() == id) {
                        return true;
                    }
                } catch (NumberFormatException ignored) {}
            }
        }

        // Candidate & HR can always view their own interviews (filtered by controller logic)
        if (httpMethod.equals("GET") && path.startsWith("/api/v1/interviews")) {
            return true;
        }

        // Candidate can always respond to their own interview
        if (httpMethod.equals("PATCH") && path.equals("/api/v1/interviews/candidate-respond")) {
            return true;
        }

        // Any authenticated user can read or delete their own notifications
        if ((httpMethod.equals("GET") || httpMethod.equals("DELETE")) && path.startsWith("/api/v1/notifications")) {
            return true;
        }

        // Cho phép người dùng cập nhật thông tin cá nhân (sẽ được kiểm tra chi tiết ở UserController)
        if (httpMethod.equals("PUT") && "/api/v1/users".equals(path)) {
            return true;
        }

        if (!email.isEmpty()) {
            if (email.equals("admin@gmail.com")) {
                return true;
            }
            User currentUser = this.userService.fetchUserByEmail(email);
            if (currentUser != null) {
                Role role = currentUser.getRole();
                if(role != null) {
                    List<Permission> permissions = role.getPermissions();
                    boolean isAllow = permissions.stream().anyMatch(item
                            -> item.getApiPath().equals(path) && item.getMethod().equals(httpMethod));

                    if (!isAllow) {
                        throw new PermissionException("Bạn không có quyền truy cập Endpoint này!");
                    }
                }
                else {
                    throw new PermissionException("Bạn không có quyền truy cập Endpoint này!");
                }
            }
        }

        return true;
    }

}
