package thanhanh.job_recruitment.dto.request.Interview;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
public class CreateInterviewRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Interview time is required")
    private Instant interviewTime;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Candidate ID is required")
    private Long candidateId;

    @NotNull(message = "Job ID is required")
    private Long jobId;
}
