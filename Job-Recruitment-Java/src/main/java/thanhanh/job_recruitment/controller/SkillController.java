package thanhanh.job_recruitment.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.Skill;
import thanhanh.job_recruitment.dto.request.Skill.CreateSkillRequest;
import thanhanh.job_recruitment.dto.request.Skill.UpdateSkillRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Skill.SkillResponse;
import thanhanh.job_recruitment.service.SkillService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;

@RestController
@RequestMapping("/api/v1/skills")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SkillController {

    SkillService skillService;

    @PostMapping("/create")
    @ApiMessage("Create a new skill")
    public ResponseEntity<SkillResponse> createSkill(@Valid @RequestBody CreateSkillRequest skillRequest) throws IdInvalidException {
        boolean existsSkill = this.skillService.checkExistsSkillByName(skillRequest.getName());

        if (existsSkill) {
            throw new IdInvalidException("Skill has existed");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(this.skillService.createSkill(skillRequest));
    }

    @PutMapping("/update")
    @ApiMessage("Update a new skill")
    public ResponseEntity<SkillResponse> updateSkill (@Valid @RequestBody UpdateSkillRequest request) throws IdInvalidException {
        boolean existsSkill = this.skillService.checkExistsSkillById(request.getId());

        if (!existsSkill) {
            throw new IdInvalidException("Not found skill with id " + request.getId());
        }

        return ResponseEntity.ok().body(this.skillService.updateSkill(request));
    }

    @GetMapping("{id}")
    @ApiMessage("Fetch skill by id")
    public ResponseEntity<SkillResponse> fetchSkillById (@PathVariable("id") long id) throws IdInvalidException {
        boolean existsSkill = this.skillService.checkExistsSkillById(id);

        if (!existsSkill) {
            throw new IdInvalidException("Not found skill with id " + id);
        }

        return ResponseEntity.ok().body(this.skillService.fetchSkillById(id));
    }

    @GetMapping()
    @ApiMessage("Fetch all skill")
    public ResponseEntity<ResultPagination> fetchAllSkills (
            @Filter Specification<Skill> spec,
             Pageable pageable
            ) {
        return ResponseEntity.ok().body(this.skillService.fetchAllSkill(spec, pageable));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a skill")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        // check id
        boolean existSkill = this.skillService.checkExistsSkillById(id);
        if (!existSkill) {
            throw new IdInvalidException("Skill id = " + id + " not existed");
        }
        this.skillService.deleteSkill(id);
        return ResponseEntity.ok().body(null);
    }



}
