package thanhanh.job_recruitment.dto.request.Resume;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import thanhanh.job_recruitment.util.constant.ResumeStateEnum;

@Getter
@Setter
public class UpdateResumeRequest {
    @NotNull(message = "Id is not be empty")
    private Long id;

    private ResumeStateEnum status;
}
