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
public class ChatMessageResponse {
    private long id;
    private long conversationId;
    private long senderId;
    private String senderName;
    private String senderAvatar;
    private String content;
    private String type;
    private boolean isRead;
    private Instant createdAt;
}
