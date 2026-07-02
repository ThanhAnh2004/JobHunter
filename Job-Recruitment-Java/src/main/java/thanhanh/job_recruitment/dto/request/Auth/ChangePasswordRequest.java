package thanhanh.job_recruitment.dto.request.Auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {
    @NotBlank(message = "Old password cannot be empty")
    String oldPassword;

    @NotBlank(message = "New password cannot be empty")
    String newPassword;
}
