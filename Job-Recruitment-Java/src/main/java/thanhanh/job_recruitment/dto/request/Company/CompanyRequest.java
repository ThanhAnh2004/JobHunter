package thanhanh.job_recruitment.dto.request.Company;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class CompanyRequest {
    @NotBlank(message = "Name is not be empty")
    String name;

    String description;
    String address;
    String logo;
}
