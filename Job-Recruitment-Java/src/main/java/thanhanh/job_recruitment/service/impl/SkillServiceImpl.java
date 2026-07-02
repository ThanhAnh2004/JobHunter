package thanhanh.job_recruitment.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import thanhanh.job_recruitment.domain.Skill;
import thanhanh.job_recruitment.dto.request.Skill.CreateSkillRequest;
import thanhanh.job_recruitment.dto.request.Skill.UpdateSkillRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.Meta;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Skill.SkillResponse;
import thanhanh.job_recruitment.repository.SkillRepository;
import thanhanh.job_recruitment.service.SkillService;

import java.util.Optional;

@Service
@AllArgsConstructor
public class SkillServiceImpl implements SkillService {
    private final SkillRepository skillRepository;


    @Override
    public SkillResponse createSkill(CreateSkillRequest skillRequest) {
       Skill skill = Skill.builder()
               .name(skillRequest.getName())
               .build();
       this.skillRepository.save(skill);

       return mapperSkillToSkillResponse(skill);
    }

    @Override
    public boolean checkExistsSkillById(long id) {
        return this.skillRepository.existsById(id);
    }

    @Override
    public boolean checkExistsSkillByName(String name) {
        return this.skillRepository.existsByName(name);
    }

    @Override
    public SkillResponse updateSkill(UpdateSkillRequest request) {
        Skill currentSkill = this.skillRepository.findById(request.getId()).get();

        currentSkill.setName(request.getName());
        this.skillRepository.save(currentSkill);

        return this.mapperSkillToSkillResponse(currentSkill);

    }

    @Override
    public SkillResponse fetchSkillById(long id) {
        Skill skill = this.skillRepository.findById(id).get();

        return mapperSkillToSkillResponse(skill);
    }

    @Override
    public ResultPagination fetchAllSkill(Specification<Skill> spec, Pageable pageable) {
        Page<Skill> pageSkill = this.skillRepository.findAll(spec, pageable);

        Page<SkillResponse> pageSkillResponse = pageSkill.map(this::mapperSkillToSkillResponse);

        Meta meta = Meta.builder()
                .page(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .pages(pageSkillResponse.getTotalPages())
                .total(pageSkillResponse.getTotalElements())
                .build();

        return ResultPagination.builder()
                .meta(meta)
                .result(pageSkillResponse.getContent())
                .build();

    }

    @Override
    public void deleteSkill(long id) {
        Skill skill= this.skillRepository.findById(id).get();

        // Check job
        skill.getJobs().forEach(x -> x.getSkills().remove(skill));

        // Check subscriber
        skill.getSubscribers().forEach(x -> x.getSkills().remove(skill));

        skillRepository.delete(skill);


    }

    private SkillResponse mapperSkillToSkillResponse (Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .createdAt(skill.getCreatedAt())
                .createBy(skill.getCreatedBy())
                .updatedAt(skill.getUpdatedAt())
                .updatedBy(skill.getUpdatedBy())
                .build();
    }

}

