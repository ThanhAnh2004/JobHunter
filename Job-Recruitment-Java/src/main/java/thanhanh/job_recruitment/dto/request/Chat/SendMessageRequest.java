package thanhanh.job_recruitment.dto.request.Chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendMessageRequest {

    @NotNull(message = "Conversation ID không được để trống")
    private Long conversationId;

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String content;

    private String type = "TEXT";
}
