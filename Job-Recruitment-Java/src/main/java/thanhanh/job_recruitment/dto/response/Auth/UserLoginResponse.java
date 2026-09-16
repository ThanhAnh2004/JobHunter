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
    String avatar;
    Role role;
    CompanyUser company;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CompanyUser {
        private long id;
        private String name;
        private String logo;
    }
}
