package thanhanh.job_recruitment.dto.response.Dashboard;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardResponse {
    long totalUsers;
    long totalCompanies;
    long totalJobs;
    long totalResumes;

    long countPendingResumes;
    long countReviewingResumes;
    long countApprovedResumes;
    long countRejectedResumes;
}
