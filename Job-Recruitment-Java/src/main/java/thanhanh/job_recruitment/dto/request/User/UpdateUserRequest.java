package thanhanh.job_recruitment.dto.request.User;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.domain.Role;
import thanhanh.job_recruitment.util.constant.GenderEnum;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    @NotNull(message = "User id is not be empty")
    Long id;

    String name;
    String email;
    int age;
    GenderEnum gender;
    String address;
    RoleUser role;
    CompanyUser company;

    @Getter
    @Setter
    public static class RoleUser {
        private long id;
        private String name;
    }

    @Getter
    @Setter
    public static class CompanyUser {
        private long id;
        private String name;
    }
}
