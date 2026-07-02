package thanhanh.job_recruitment.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import thanhanh.job_recruitment.domain.InterviewSchedule;
import thanhanh.job_recruitment.dto.request.Interview.CandidateRespondInterviewRequest;
import thanhanh.job_recruitment.dto.request.Interview.CreateInterviewRequest;
import thanhanh.job_recruitment.dto.request.Interview.UpdateInterviewRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.util.exception.PermissionException;

public interface InterviewScheduleService {
    InterviewSchedule create(CreateInterviewRequest request) throws IdInvalidException;
    InterviewSchedule update(UpdateInterviewRequest request) throws IdInvalidException;
    InterviewSchedule candidateRespond(CandidateRespondInterviewRequest request) throws IdInvalidException, PermissionException;
    void delete(long id) throws IdInvalidException;
    InterviewSchedule fetchById(long id) throws IdInvalidException;
    ResultPagination fetchAll(Specification<InterviewSchedule> spec, Pageable pageable);
}

