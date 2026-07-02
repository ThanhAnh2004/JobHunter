package thanhanh.job_recruitment.dto.request.Skill;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CreateSkillRequest {
    @NotBlank(message = "Skill name not be empty!")
    private String name;
}
