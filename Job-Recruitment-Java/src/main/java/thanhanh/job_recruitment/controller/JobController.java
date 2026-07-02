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
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.dto.request.Job.CreateJobRequest;
import thanhanh.job_recruitment.dto.request.Job.UpdateJobRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Job.JobResponse;
import thanhanh.job_recruitment.service.JobService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.util.exception.PermissionException;
import thanhanh.job_recruitment.util.SecurityUtil;

@RestController
@RequestMapping("/api/v1/jobs")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobController {
    JobService jobService;
    UserRepository userRepository;

    @PostMapping
    @ApiMessage("Create a new job")
    public ResponseEntity<JobResponse> createJob(@RequestBody CreateJobRequest request) throws PermissionException {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            if (currentUser == null || currentUser.getCompany() == null || request.getCompany() == null || currentUser.getCompany().getId() != request.getCompany().getId()) {
                throw new PermissionException("Bạn chỉ được phép đăng tuyển công việc cho công ty của mình.");
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.jobService.createJob(request));
    }

    @PutMapping
    @ApiMessage("Update a job")
    public ResponseEntity<JobResponse> updateJob(@Valid @RequestBody UpdateJobRequest request) throws IdInvalidException, PermissionException {
        boolean checkExists = this.jobService.checkExistsById(request.getId());

        if (!checkExists) {
            throw new IdInvalidException("Not found job with id " + request.getId());
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            JobResponse existingJob = this.jobService.fetchJobById(request.getId());
            if (currentUser == null || currentUser.getCompany() == null || existingJob == null || existingJob.getCompany() == null || currentUser.getCompany().getId() != existingJob.getCompany().getId()) {
                throw new PermissionException("Bạn chỉ được phép cập nhật công việc của công ty mình.");
            }
            if (request.getCompany() == null || currentUser.getCompany().getId() != request.getCompany().getId()) {
                throw new PermissionException("Bạn không thể thay đổi công ty của công việc sang công ty khác.");
            }
        }

        return ResponseEntity.ok().body(this.jobService.updateJob(request));
    }

    @GetMapping("/{id}")
    @ApiMessage("Fetch a job by id")
    public ResponseEntity<JobResponse> fetchById(@PathVariable("id") long id) throws IdInvalidException {
        boolean checkExists = this.jobService.checkExistsById(id);

        if (!checkExists) {
            throw new IdInvalidException("Not found job with id " + id);
        }

        return ResponseEntity.ok().body(this.jobService.fetchJobById(id));
    }

    @GetMapping
    @ApiMessage("Fetch all job")
    public ResponseEntity<ResultPagination> fetchAllJob(
            @Filter Specification<Job> spec,
            Pageable pageable
            ) {
        return ResponseEntity.ok().body(this.jobService.fetchAllJob(spec,pageable));
    }

    @DeleteMapping("{id}")
    @ApiMessage("Delete a job by id")
    public ResponseEntity<JobResponse> deleteById(@PathVariable("id") long id) throws IdInvalidException, PermissionException {
        boolean checkExists = this.jobService.checkExistsById(id);

        if (!checkExists) {
            throw new IdInvalidException("Not found job with id " + id);
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            JobResponse existingJob = this.jobService.fetchJobById(id);
            if (currentUser == null || currentUser.getCompany() == null || existingJob == null || existingJob.getCompany() == null || currentUser.getCompany().getId() != existingJob.getCompany().getId()) {
                throw new PermissionException("Bạn chỉ được phép xóa công việc của công ty mình.");
            }
        }

        this.jobService.deleteJobById(id);

        return ResponseEntity.noContent().build();
    }

}
