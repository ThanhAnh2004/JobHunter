package thanhanh.job_recruitment.dto.response.Permission;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PermissionResponse {
    private long id;
    private String name;
    private String apiPath;
    private String method;
    private String module;
    Instant createdAt;
    Instant updatedAt;
    String createBy;
    String updatedBy;
}
