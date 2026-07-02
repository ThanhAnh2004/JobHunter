package thanhanh.job_recruitment.dto.request.Resume;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import thanhanh.job_recruitment.util.constant.ResumeStateEnum;

@Getter
@Setter
public class CreateResumeRequest {
    @NotBlank(message = "email không được để trống")
    private String email;

    @NotBlank(message = "url không được để trống")
    private String url;

    @NotNull(message = "status không được để trống")
    private ResumeStateEnum status;

    @NotNull(message = "userId không được để trống")
    private Long userId;

    @NotNull(message = "jobId không được để trống")
    private Long jobId;
}

