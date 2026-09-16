package thanhanh.job_recruitment.controller;

import com.turkraft.springfilter.boot.Filter;
import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.domain.Resume;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.dto.request.Resume.CreateResumeRequest;
import thanhanh.job_recruitment.dto.request.Resume.UpdateResumeRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Resume.CreateResumeResponse;
import thanhanh.job_recruitment.dto.response.Resume.FetchResumeResponse;
import thanhanh.job_recruitment.dto.response.Resume.UpdateResumeResponse;
import thanhanh.job_recruitment.dto.response.Resume.AIMatchResponse;
import thanhanh.job_recruitment.service.ResumeService;
import thanhanh.job_recruitment.service.UserService;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;

import java.util.ArrayList;
import java.util.List;


import thanhanh.job_recruitment.repository.ResumeRepository;
import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.util.exception.PermissionException;

@RestController
@RequestMapping("/api/v1/resumes")
@AllArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;
    private final UserService userService;
    private final FilterBuilder filterBuilder;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;


    @PostMapping
    @ApiMessage("Create a resume")
    public ResponseEntity<CreateResumeResponse> create(
            @Valid @RequestBody CreateResumeRequest request
    ) throws IdInvalidException {
        Resume resume = new Resume();
        resume.setEmail(request.getEmail());
        resume.setUrl(request.getUrl());
        resume.setStatus(request.getStatus());

        User user = new User();
        user.setId(request.getUserId());
        resume.setUser(user);

        Job job = new Job();
        job.setId(request.getJobId());
        resume.setJob(job);

        // check id exists
        boolean isIdExist = this.resumeService.checkResumeExistByUserAndJob(resume);
        if (!isIdExist) {
            throw new IdInvalidException("User id/Job id not exists");
        }

        // create new resume
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.resumeService.create(resume));
    }

    @PutMapping
    @ApiMessage("Update a resume")
    public ResponseEntity<UpdateResumeResponse> update(@RequestBody UpdateResumeRequest resume)
            throws IdInvalidException, PermissionException {
        // check resume exist by id
        boolean checkExists = this.resumeService.checkExistById(resume.getId());
        if (!checkExists) {
            throw new IdInvalidException("Not found resume with id " + resume.getId());
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            Resume existingResume = this.resumeRepository.findById(resume.getId()).orElse(null);
            if (currentUser == null || existingResume == null || existingResume.getJob() == null || existingResume.getJob().getCompany() == null ||
                currentUser.getCompany() == null || currentUser.getCompany().getId() != existingResume.getJob().getCompany().getId()) {
                throw new PermissionException("Bạn không có quyền cập nhật hồ sơ ứng tuyển này.");
            }
        }

        return ResponseEntity.ok().body(this.resumeService.update(resume));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a resume by id")
    public ResponseEntity<Void> delete(@PathVariable("id") long id)
            throws IdInvalidException, PermissionException {
        // check resume exist by id
        boolean checkExists = this.resumeService.checkExistById(id);
        if (!checkExists) {
            throw new IdInvalidException("Not found resume with id " + id);
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            Resume existingResume = this.resumeRepository.findById(id).orElse(null);
            if (currentUser == null || existingResume == null || existingResume.getJob() == null || existingResume.getJob().getCompany() == null ||
                currentUser.getCompany() == null || currentUser.getCompany().getId() != existingResume.getJob().getCompany().getId()) {
                throw new PermissionException("Bạn không có quyền xóa hồ sơ ứng tuyển này.");
            }
        }

        this.resumeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @ApiMessage("Fetch a resume by id")
    public ResponseEntity<FetchResumeResponse> fetchById(
            @PathVariable("id") long id) throws IdInvalidException, PermissionException {
        // check resume exist by id
        boolean checkExists = this.resumeService.checkExistById(id);
        if (!checkExists) {
            throw new IdInvalidException("Not found resume with id " + id);
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            Resume existingResume = this.resumeRepository.findById(id).orElse(null);
            if (currentUser == null || existingResume == null) {
                throw new PermissionException("Không tìm thấy hồ sơ ứng tuyển.");
            }
            boolean isOwner = existingResume.getUser() != null && existingResume.getUser().getId() == currentUser.getId();
            boolean isCompanyHR = existingResume.getJob() != null && existingResume.getJob().getCompany() != null &&
                currentUser.getCompany() != null && currentUser.getCompany().getId() == existingResume.getJob().getCompany().getId();
            
            if (!isOwner && !isCompanyHR) {
                throw new PermissionException("Bạn không có quyền xem chi tiết hồ sơ ứng tuyển này.");
            }
        }

        return ResponseEntity
                .ok()
                .body(this.resumeService.fetchById(id));
    }

    @GetMapping("/{id}/ai-match")
    @ApiMessage("Get AI Match Score for Resume")
    public ResponseEntity<AIMatchResponse> getAIMatchScore(
            @PathVariable("id") long id) throws IdInvalidException, PermissionException {
        // check resume exist by id
        boolean checkExists = this.resumeService.checkExistById(id);
        if (!checkExists) {
            throw new IdInvalidException("Not found resume with id " + id);
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            Resume existingResume = this.resumeRepository.findById(id).orElse(null);
            if (currentUser == null || existingResume == null) {
                throw new PermissionException("Không tìm thấy hồ sơ ứng tuyển.");
            }
            boolean isOwner = existingResume.getUser() != null && existingResume.getUser().getId() == currentUser.getId();
            boolean isCompanyHR = existingResume.getJob() != null && existingResume.getJob().getCompany() != null &&
                currentUser.getCompany() != null && currentUser.getCompany().getId() == existingResume.getJob().getCompany().getId();
            
            if (!isOwner && !isCompanyHR) {
                throw new PermissionException("Bạn không có quyền xem chi tiết hồ sơ ứng tuyển này.");
            }
        }

        return ResponseEntity.ok().body(this.resumeService.getAIMatchScore(id));
    }

    @GetMapping
    @ApiMessage("Fetch all resume with paginate")
    public ResponseEntity<ResultPagination> fetchAll(
            @Filter Specification<Resume> spec,
            Pageable pageable
    ) {

        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        Specification<Resume> finalSpec = spec;

        if (email != null) {
            User currentUser = this.userService.fetchUserByEmail(email);
            boolean isSuperAdmin = email.equals("admin@gmail.com") || 
                (currentUser != null && currentUser.getRole() != null && "SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName()));
            boolean isHR = currentUser != null && currentUser.getRole() != null && "HR".equalsIgnoreCase(currentUser.getRole().getName());

            if (!isSuperAdmin) {
                if (isHR && currentUser.getCompany() != null) {
                    Company userCompany = currentUser.getCompany();
                    List<Job> companyJob = userCompany.getJobs();
                    if (companyJob != null && !companyJob.isEmpty()) {
                        List<Long> listJobId = companyJob.stream().map(Job::getId).toList();
                        Specification<Resume> jobInSpec = (root, query, cb) -> root.get("job").get("id").in(listJobId);
                        finalSpec = jobInSpec.and(spec);
                    } else {
                        Specification<Resume> emptySpec = (root, query, cb) -> cb.disjunction();
                        finalSpec = emptySpec.and(spec);
                    }
                } else if (currentUser != null) {
                    long userId = currentUser.getId();
                    String userEmail = currentUser.getEmail();
                    Specification<Resume> userSpec = (root, query, cb) -> 
                        cb.or(
                            cb.equal(root.get("user").get("id"), userId),
                            cb.equal(root.get("email"), userEmail)
                        );
                    finalSpec = userSpec.and(spec);
                }
            }
        }

        return ResponseEntity.ok().body(this.resumeService.fetchAllResume(finalSpec, pageable));
    }

    @PostMapping("/by-user")
    @ApiMessage("Get list resumes by user")
    public ResponseEntity<ResultPagination> fetchResumeByUser(
            Pageable pageable
    ) {
        return ResponseEntity
                .ok()
                .body(this.resumeService.fetchResumeByUser(pageable));
    }

}
