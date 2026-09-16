package thanhanh.job_recruitment.dto.request.Chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateConversationRequest {
    private Long companyId;
    private Long candidateId;
    private Long jobId;
    private String initialMessage;
}
