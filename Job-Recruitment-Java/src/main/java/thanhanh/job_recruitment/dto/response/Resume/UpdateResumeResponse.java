package thanhanh.job_recruitment.dto.response.Resume;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class UpdateResumeResponse {
    private Instant updatedAt;
    private String updatedBy;
}
