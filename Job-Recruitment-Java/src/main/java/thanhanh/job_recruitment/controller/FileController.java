package thanhanh.job_recruitment.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import thanhanh.job_recruitment.dto.response.File.UploadFileResponse;
import thanhanh.job_recruitment.service.FileService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.StorageException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/v1/files")
public class FileController {

    private final FileService fileService;

    @Value("${upload-file.base-uri}")
    private String baseURI;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping()
    @ApiMessage("Upload a single file")
    public ResponseEntity<UploadFileResponse> upload(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("folder") String folder
            ) throws URISyntaxException, IOException, StorageException {
        // skip validate
        if (file == null || file.isEmpty()){
            throw new StorageException("File is empty. Please upload a file");
        }
        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = Arrays.asList(
                "pdf",
                "jpg",
                "jpeg",
                "png",
                "doc",
                "docx"
        );


        // create a directory if not exists
        this.fileService.createDirectory(baseURI + folder);
        // store file
        String uploadFile = this.fileService.storeFile(file, folder);
        boolean isValid = allowedExtensions.stream().anyMatch(item
                -> fileName.toLowerCase().endsWith(item));

        if (!isValid) {
            throw new StorageException(
                    "Invalid file extension. only allows " + allowedExtensions.toString()
            );
        }


        UploadFileResponse response = new UploadFileResponse(uploadFile, Instant.now());

        return ResponseEntity.ok().body(response);
    }

    @GetMapping()
    @ApiMessage("Download a file")
    public ResponseEntity<Resource> download(
            @RequestParam(name = "fileName", required = false) String fileName,
            @RequestParam(name = "folder", required = false) String folder
    ) throws StorageException, URISyntaxException, FileNotFoundException {
        if (fileName == null || folder == null) {
            throw new StorageException(
                    "Missing required params : (fileName or folder) in query params."
            );
        }

        // check file exist (and not a directory)
        long fileLength = this.fileService.getFileLength(fileName, folder);
        if (fileLength == 0) {
            throw new StorageException(
                    "File with name = " + fileName + " not found."
            );
        }

        // download a file
        InputStreamResource resource =
                this.fileService.getResource(fileName, folder);

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\""
                )
                .contentLength(fileLength)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

}
