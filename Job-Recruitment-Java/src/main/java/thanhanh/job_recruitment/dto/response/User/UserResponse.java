package thanhanh.job_recruitment.dto.response.User;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import thanhanh.job_recruitment.domain.Role;
import thanhanh.job_recruitment.dto.response.Company.CompanyResponse;
import thanhanh.job_recruitment.util.constant.GenderEnum;

import java.time.Instant;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    long id;
    String name;
    String email;
    int age;
    GenderEnum gender;
    String address;
    @JsonIgnoreProperties(value = "users")
    RoleUser role;
    CompanyUser company;
    Instant createdAt;
    String createdBy;
    Instant updatedAt;
    String updatedBy;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RoleUser {
        private long id;
        private String name;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Getter
    @Setter
    public static class CompanyUser {
        private long id;
        private String name;
    }
}
