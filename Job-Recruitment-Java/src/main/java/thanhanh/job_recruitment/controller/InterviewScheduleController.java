package thanhanh.job_recruitment.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.domain.InterviewSchedule;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.dto.request.Interview.CandidateRespondInterviewRequest;
import thanhanh.job_recruitment.dto.request.Interview.CreateInterviewRequest;
import thanhanh.job_recruitment.dto.request.Interview.UpdateInterviewRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.service.InterviewScheduleService;
import thanhanh.job_recruitment.service.UserService;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.util.exception.PermissionException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/interviews")
public class InterviewScheduleController {

    private final InterviewScheduleService interviewScheduleService;
    private final UserService userService;

    public InterviewScheduleController(InterviewScheduleService interviewScheduleService, UserService userService) {
        this.interviewScheduleService = interviewScheduleService;
        this.userService = userService;
    }

    @PostMapping
    @ApiMessage("Create a new interview schedule")
    public ResponseEntity<InterviewSchedule> create(@Valid @RequestBody CreateInterviewRequest request) throws IdInvalidException, PermissionException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.interviewScheduleService.create(request));
    }

    @PutMapping
    @ApiMessage("Update an interview schedule")
    public ResponseEntity<InterviewSchedule> update(@Valid @RequestBody UpdateInterviewRequest request) throws IdInvalidException, PermissionException {
        return ResponseEntity.ok(this.interviewScheduleService.update(request));
    }

    /**
     * Endpoint dành riêng cho ứng viên: đồng ý / từ chối / gửi ghi chú
     * Path: PATCH /api/v1/interviews/candidate-respond
     * Không cần quyền đặc biệt, chỉ cần xác thực JWT và là chủ nhân của interview đó
     */
    @PatchMapping("/candidate-respond")
    @ApiMessage("Candidate responds to an interview schedule")
    public ResponseEntity<InterviewSchedule> candidateRespond(@Valid @RequestBody CandidateRespondInterviewRequest request) throws IdInvalidException, PermissionException {
        return ResponseEntity.ok(this.interviewScheduleService.candidateRespond(request));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete an interview schedule")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException, PermissionException {
        this.interviewScheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @ApiMessage("Fetch interview schedule by id")
    public ResponseEntity<InterviewSchedule> fetchById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(this.interviewScheduleService.fetchById(id));
    }

    @GetMapping
    @ApiMessage("Fetch all interview schedules with pagination")
    public ResponseEntity<ResultPagination> fetchAll(
            @Filter Specification<InterviewSchedule> spec,
            Pageable pageable
    ) {
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        Specification<InterviewSchedule> finalSpec = spec;

        if (email != null && !email.equals("admin@gmail.com")) {
            User currentUser = this.userService.fetchUserByEmail(email);
            if (currentUser != null) {
                boolean isSuperAdmin = currentUser.getRole() != null && "SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
                boolean isHR = currentUser.getRole() != null && "HR".equalsIgnoreCase(currentUser.getRole().getName());

                if (isSuperAdmin) {
                    // super admin sees all
                } else if (isHR && currentUser.getCompany() != null) {
                    // HR sees interviews for their company
                    long companyId = currentUser.getCompany().getId();
                    Specification<InterviewSchedule> companySpec = (root, query, cb) -> 
                        cb.equal(root.get("job").get("company").get("id"), companyId);
                    finalSpec = finalSpec == null ? companySpec : finalSpec.and(companySpec);
                } else {
                    // Candidate sees only their own interviews (by candidate ID or candidate Email)
                    long currentUserId = currentUser.getId();
                    String currentUserEmail = currentUser.getEmail();
                    Specification<InterviewSchedule> candidateSpec = (root, query, cb) -> 
                        cb.or(
                            cb.equal(root.get("candidate").get("id"), currentUserId),
                            cb.equal(root.get("candidate").get("email"), currentUserEmail)
                        );
                    finalSpec = finalSpec == null ? candidateSpec : finalSpec.and(candidateSpec);
                }
            } else {
                Specification<InterviewSchedule> emptySpec = (root, query, cb) -> cb.disjunction();
                finalSpec = finalSpec == null ? emptySpec : finalSpec.and(emptySpec);
            }
        }

        return ResponseEntity.ok(this.interviewScheduleService.fetchAll(finalSpec, pageable));
    }
}

