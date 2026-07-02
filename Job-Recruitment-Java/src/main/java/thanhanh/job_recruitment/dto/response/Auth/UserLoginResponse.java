package thanhanh.job_recruitment.dto.response.Auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import thanhanh.job_recruitment.domain.Role;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserLoginResponse {
    long id;
    String name;
    String email;
    Role role;
}
