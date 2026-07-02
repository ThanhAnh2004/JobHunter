package thanhanh.job_recruitment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {
    @Bean
    PermissionInterceptor getPermissionInterceptor() {
        return new PermissionInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] whiteList = {
                "/",
                "/api/v1/auth/**",
                "/storage/**",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/api/v1/files",
                "/api/v1/resumes/**",
                "/api/v1/email/**",
                "/api/v1/email",
                "/api/v1/subscribers/**",
                "/api/v1/dashboard",
                "/api/v1/notifications",
                "/api/v1/notifications/**"
        };
        registry
                .addInterceptor(getPermissionInterceptor())
                .excludePathPatterns(whiteList);
    }

}
