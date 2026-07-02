package thanhanh.job_recruitment.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.dto.request.Job.CreateJobRequest;
import thanhanh.job_recruitment.dto.request.Job.UpdateJobRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Job.JobResponse;

public interface JobService {
    JobResponse createJob (CreateJobRequest request);
    JobResponse updateJob (UpdateJobRequest request);
    boolean checkExistsById (long id);
    JobResponse fetchJobById (long id);
    ResultPagination fetchAllJob(Specification<Job> spec, Pageable pageable);
    void deleteJobById(long id);
}
