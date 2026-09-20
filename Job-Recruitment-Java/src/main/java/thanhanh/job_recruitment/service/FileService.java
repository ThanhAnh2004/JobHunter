package thanhanh.job_recruitment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService {

    @Value("${upload-file.base-uri:}")
    private String baseURI;

    public Path getResolvedBasePath() {
        if (baseURI != null && !baseURI.trim().isEmpty()) {
            String uriStr = baseURI.trim();
            if (uriStr.startsWith("file:///")) {
                try {
                    return Paths.get(new URI(uriStr));
                } catch (Exception e) {
                    return Paths.get(uriStr.substring(8));
                }
            } else if (uriStr.startsWith("file:/")) {
                try {
                    return Paths.get(new URI(uriStr));
                } catch (Exception e) {
                    return Paths.get(uriStr.substring(6));
                }
            } else if (uriStr.startsWith("file:")) {
                String pathPart = uriStr.substring(5);
                if ("./upload/".equals(pathPart) || "./upload".equals(pathPart) || "upload/".equals(pathPart) || "upload".equals(pathPart)) {
                    File backendDir = new File("Job-Recruitment-Java");
                    if (backendDir.isDirectory()) {
                        return Paths.get("Job-Recruitment-Java", "upload");
                    }
                }
                return Paths.get(pathPart);
            } else {
                return Paths.get(uriStr);
            }
        }
        File backendDir = new File("Job-Recruitment-Java");
        if (backendDir.isDirectory()) {
            return Paths.get("Job-Recruitment-Java", "upload");
        }
        return Paths.get("upload");
    }

    public void createDirectory(String folder) throws URISyntaxException, IOException {
        Path targetDir;
        if (folder != null && (folder.startsWith("file:") || folder.contains(":\\") || folder.contains(":/"))) {
            targetDir = folder.startsWith("file:") ? Paths.get(new URI(folder)) : Paths.get(folder);
        } else {
            targetDir = getResolvedBasePath();
            if (folder != null && !folder.trim().isEmpty()) {
                targetDir = targetDir.resolve(folder.trim());
            }
        }
        if (!Files.exists(targetDir)) {
            Files.createDirectories(targetDir);
            System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + targetDir.toAbsolutePath());
        }
    }

    public String storeFile(MultipartFile file, String folder) throws URISyntaxException, IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            originalFilename = "file.png";
        }

        String baseName = originalFilename;
        String extension = "";
        int lastDotIndex = originalFilename.lastIndexOf('.');
        if (lastDotIndex >= 0) {
            baseName = originalFilename.substring(0, lastDotIndex);
            extension = originalFilename.substring(lastDotIndex);
        }

        // Clean base name to alphanumeric, dash, underscore
        baseName = baseName.replaceAll("[^a-zA-Z0-9_-]", "_");
        if (baseName.isEmpty()) {
            baseName = "image";
        }

        // Generate unique suffix with timestamp and random number to avoid collision
        long randomSuffix = System.currentTimeMillis() + (long)(Math.random() * 90000 + 10000);
        String finalName = baseName + "_" + randomSuffix + extension;

        Path targetDir = getResolvedBasePath();
        if (folder != null && !folder.trim().isEmpty()) {
            targetDir = targetDir.resolve(folder.trim());
        }
        if (!Files.exists(targetDir)) {
            Files.createDirectories(targetDir);
        }
        Path targetPath = targetDir.resolve(finalName);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
        return finalName;
    }

    public long getFileLength(String fileName, String folder) throws URISyntaxException {
        Path targetDir = getResolvedBasePath();
        if (folder != null && !folder.trim().isEmpty()) {
            targetDir = targetDir.resolve(folder.trim());
        }
        Path targetPath = targetDir.resolve(fileName);
        File tmpDir = targetPath.toFile();

        // file không tồn tại, hoặc file là 1 director => return 0
        if (!tmpDir.exists() || tmpDir.isDirectory())
            return 0;
        return tmpDir.length();
    }

    public InputStreamResource getResource(String fileName, String folder)
            throws URISyntaxException, FileNotFoundException {
        Path targetDir = getResolvedBasePath();
        if (folder != null && !folder.trim().isEmpty()) {
            targetDir = targetDir.resolve(folder.trim());
        }
        Path targetPath = targetDir.resolve(fileName);
        File file = targetPath.toFile();
        if (!file.exists()) {
            throw new FileNotFoundException("File not found: " + fileName);
        }
        return new InputStreamResource(new FileInputStream(file));
    }

}
