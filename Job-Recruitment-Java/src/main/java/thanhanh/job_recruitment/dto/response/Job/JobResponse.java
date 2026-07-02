package thanhanh.job_recruitment.dto.response.Job;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.domain.Skill;
import thanhanh.job_recruitment.dto.response.Company.CompanyResponse;
import thanhanh.job_recruitment.util.constant.LevelEnum;

import java.time.Instant;
import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobResponse {
    long id;
    String name;
    String location;
    double salary;
    int quantity;
    LevelEnum level;
    boolean active;
    String description;
    Instant startDate;
    Instant endDate;
    @JsonIgnoreProperties(value = {"jobs"})
    CompanyResponse company;
    @JsonIgnoreProperties(value = {"jobs"})
    List<Skill> skills;
    Instant createdAt;
    Instant updatedAt;
    String createBy;
    String updatedBy;
    int compatibilityScore;
}
