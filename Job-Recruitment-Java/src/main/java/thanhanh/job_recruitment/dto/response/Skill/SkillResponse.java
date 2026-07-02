package thanhanh.job_recruitment.dto.response.Skill;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillResponse {
    long id;
    String name;
    Instant createdAt;
    Instant updatedAt;
    String createBy;
    String updatedBy;
}
