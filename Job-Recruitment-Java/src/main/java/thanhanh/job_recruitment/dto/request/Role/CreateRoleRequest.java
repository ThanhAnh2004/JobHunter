package thanhanh.job_recruitment.dto.request.Role;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import thanhanh.job_recruitment.domain.Permission;

import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateRoleRequest {
    @NotBlank(message = "Name is not be empty")
    String name;
    String description;
    boolean active;
    List<Permission> permissions;
}
