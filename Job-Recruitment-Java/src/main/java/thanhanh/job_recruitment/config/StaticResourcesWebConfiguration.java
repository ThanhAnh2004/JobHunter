package thanhanh.job_recruitment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class StaticResourcesWebConfiguration implements WebMvcConfigurer {
    @Value("${upload-file.base-uri:}")
    private String baseURI;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        List<String> locations = new ArrayList<>();
        
        if (baseURI != null && !baseURI.trim().isEmpty()) {
            String trimmed = baseURI.trim();
            if (!trimmed.endsWith("/")) {
                trimmed += "/";
            }
            locations.add(trimmed);
        }

        locations.add("file:./upload/");
        locations.add("file:./Job-Recruitment-Java/upload/");
        locations.add("file:/app/upload/");

        try {
            String userDir = System.getProperty("user.dir");
            File backendUpload = new File(userDir, "Job-Recruitment-Java/upload");
            if (backendUpload.exists()) {
                locations.add(backendUpload.toURI().toString());
            }
            File localUpload = new File(userDir, "upload");
            if (localUpload.exists()) {
                locations.add(localUpload.toURI().toString());
            }
            File parentUpload = new File(userDir, "../upload");
            if (parentUpload.exists()) {
                locations.add(parentUpload.toURI().toString());
            }
        } catch (Exception ignored) {
        }

        registry.addResourceHandler("/storage/**")
                .addResourceLocations(locations.toArray(new String[0]));
    }
}
