package thanhanh.job_recruitment.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import thanhanh.job_recruitment.domain.Skill;
import thanhanh.job_recruitment.dto.request.Skill.CreateSkillRequest;
import thanhanh.job_recruitment.dto.request.Skill.UpdateSkillRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Skill.SkillResponse;

public interface SkillService {
    SkillResponse createSkill (CreateSkillRequest request);
    boolean checkExistsSkillById(long id);
    boolean checkExistsSkillByName(String name);
    SkillResponse updateSkill(UpdateSkillRequest request);
    SkillResponse fetchSkillById (long id);
    ResultPagination fetchAllSkill (Specification<Skill> spec, Pageable pageable);
    void deleteSkill(long id);
}
