package thanhanh.job_recruitment.dto.request.Auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
    @NotBlank(message = "Username is not be empty")
    String userName;

    @NotBlank(message = "Password is not be empty")
    String password;
}
