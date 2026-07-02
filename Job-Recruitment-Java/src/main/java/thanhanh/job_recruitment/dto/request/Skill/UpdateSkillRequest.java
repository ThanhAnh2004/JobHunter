package thanhanh.job_recruitment.dto.request.Skill;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UpdateSkillRequest {
    @NotNull(message = "Skill id name not be empty!")
    private Long id;

    private String name;
}
