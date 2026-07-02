package thanhanh.job_recruitment.service;

import org.apache.tika.Tika;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class FileExtractionService {

    private final FileService fileService;
    private final Tika tika;

    public FileExtractionService(FileService fileService) {
        this.fileService = fileService;
        this.tika = new Tika();
    }

    public String extractTextFromResume(String fileName) {
        try {
            // Assume the folder for resumes is "resume" as standard in this project
            InputStreamResource resource = fileService.getResource(fileName, "resume");
            try (InputStream inputStream = resource.getInputStream()) {
                return tika.parseToString(inputStream);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
