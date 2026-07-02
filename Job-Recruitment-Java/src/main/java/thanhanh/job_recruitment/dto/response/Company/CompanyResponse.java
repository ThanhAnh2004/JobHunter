package thanhanh.job_recruitment.dto.response.Company;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyResponse {
    long id;
    String name;
    String description;
    String address;
    String logo;
    Instant createdAt;
    Instant updatedAt;
    String createBy;
    String updatedBy;
}
