package thanhanh.job_recruitment.dto.response.Chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {
    private long id;
    private long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidateAvatar;

    private long companyId;
    private String companyName;
    private String companyLogo;

    private Long jobId;
    private String jobName;

    private String lastMessage;
    private Instant lastMessageAt;
    private Long lastSenderId;

    private int unreadCount;
    private Instant createdAt;
    private Instant updatedAt;
}
