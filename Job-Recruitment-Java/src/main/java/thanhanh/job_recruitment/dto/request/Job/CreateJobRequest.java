package thanhanh.job_recruitment.dto.request.Job;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.domain.Skill;
import thanhanh.job_recruitment.util.constant.LevelEnum;

import java.time.Instant;
import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class CreateJobRequest {
    String name;
    String location;
    double salary;
    int quantity;
    LevelEnum level;
    boolean active;
    String description;
    Instant startDate;
    Instant endDate;
    Company company;
    List<Skill> skills;
}
