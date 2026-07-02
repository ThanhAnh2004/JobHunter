package thanhanh.job_recruitment.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import thanhanh.job_recruitment.dto.response.Dashboard.DashboardResponse;
import thanhanh.job_recruitment.repository.CompanyRepository;
import thanhanh.job_recruitment.repository.JobRepository;
import thanhanh.job_recruitment.repository.ResumeRepository;
import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.constant.ResumeStateEnum;

@RestController
@RequestMapping("/api/v1/dashboard")
@AllArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;

    @GetMapping
    @ApiMessage("Get dashboard statistics successfully")
    public ResponseEntity<DashboardResponse> getDashboardStats() {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (isSuperAdmin) {
            DashboardResponse stats = DashboardResponse.builder()
                    .totalUsers(this.userRepository.count())
                    .totalCompanies(this.companyRepository.count())
                    .totalJobs(this.jobRepository.count())
                    .totalResumes(this.resumeRepository.count())
                    .countPendingResumes(this.resumeRepository.countByStatus(ResumeStateEnum.PENDING))
                    .countReviewingResumes(this.resumeRepository.countByStatus(ResumeStateEnum.REVIEWING))
                    .countApprovedResumes(this.resumeRepository.countByStatus(ResumeStateEnum.APPROVED))
                    .countRejectedResumes(this.resumeRepository.countByStatus(ResumeStateEnum.REJECTED))
                    .build();
            return ResponseEntity.ok(stats);
        } else if (currentUser != null && currentUser.getCompany() != null) {
            Company userCompany = currentUser.getCompany();
            DashboardResponse stats = DashboardResponse.builder()
                    .totalUsers(this.userRepository.countByCompany(userCompany))
                    .totalCompanies(1)
                    .totalJobs(this.jobRepository.countByCompany(userCompany))
                    .totalResumes(this.resumeRepository.countByJobCompany(userCompany))
                    .countPendingResumes(this.resumeRepository.countByJobCompanyAndStatus(userCompany, ResumeStateEnum.PENDING))
                    .countReviewingResumes(this.resumeRepository.countByJobCompanyAndStatus(userCompany, ResumeStateEnum.REVIEWING))
                    .countApprovedResumes(this.resumeRepository.countByJobCompanyAndStatus(userCompany, ResumeStateEnum.APPROVED))
                    .countRejectedResumes(this.resumeRepository.countByJobCompanyAndStatus(userCompany, ResumeStateEnum.REJECTED))
                    .build();
            return ResponseEntity.ok(stats);
        } else {
            return ResponseEntity.ok(DashboardResponse.builder().build());
        }
    }
}
