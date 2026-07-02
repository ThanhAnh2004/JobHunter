package thanhanh.job_recruitment.dto.request.Interview;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import thanhanh.job_recruitment.util.constant.InterviewStateEnum;

import java.time.Instant;

@Getter
@Setter
public class UpdateInterviewRequest {
    @NotNull(message = "ID is required")
    private Long id;

    private String title;
    private Instant interviewTime;
    private String location;
    private InterviewStateEnum status;
}
