package thanhanh.job_recruitment.dto.request.Permission;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePermissionRequest {
    @NotBlank(message = "Name is not be empty")
    private String name;

    @NotBlank(message = "ApiPath is not be empty")
    private String apiPath;

    @NotBlank(message = "Method is not be empty")
    private String method;

    @NotBlank(message = "Module is not be empty")
    private String module;

}
