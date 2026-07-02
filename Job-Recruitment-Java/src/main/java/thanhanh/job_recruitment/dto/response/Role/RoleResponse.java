package thanhanh.job_recruitment.dto.response.Role;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import thanhanh.job_recruitment.domain.Permission;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoleResponse {
    private long id;
    private String name;
    private String description;
    private boolean active;
    private List<Permission> permissions;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
