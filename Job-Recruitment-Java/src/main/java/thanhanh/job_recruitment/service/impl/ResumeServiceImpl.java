package thanhanh.job_recruitment.service.impl;


import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.domain.Resume;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.dto.request.Resume.UpdateResumeRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.Meta;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Resume.CreateResumeResponse;
import thanhanh.job_recruitment.dto.response.Resume.FetchResumeResponse;
import thanhanh.job_recruitment.dto.response.Resume.UpdateResumeResponse;
import thanhanh.job_recruitment.repository.JobRepository;
import thanhanh.job_recruitment.repository.ResumeRepository;
import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.repository.NotificationRepository;
import thanhanh.job_recruitment.service.ResumeService;
import thanhanh.job_recruitment.service.FileExtractionService;
import thanhanh.job_recruitment.service.GeminiAIService;
import thanhanh.job_recruitment.dto.response.Resume.AIMatchResponse;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.domain.Notification;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    FilterBuilder fb;

    @Autowired
    private FilterParser filterParser;

    @Autowired
    private FilterSpecificationConverter filterSpecificationConverter;


    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final FileExtractionService fileExtractionService;
    private final GeminiAIService geminiAIService;

    public ResumeServiceImpl(ResumeRepository resumeRepository, UserRepository userRepository, JobRepository jobRepository, NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate, FileExtractionService fileExtractionService, GeminiAIService geminiAIService) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.fileExtractionService = fileExtractionService;
        this.geminiAIService = geminiAIService;
    }

    @Override
    public boolean checkResumeExistByUserAndJob(Resume resume) {
        // check user by id
        if (resume.getUser() == null) return false;
        Optional<User> userOptional =
                this.userRepository.findById(resume.getUser().getId());
        if (userOptional.isEmpty()) return false;

        // check job by id
        if (resume.getJob() == null) return false;
        Optional<Job> jobOptional =
                this.jobRepository.findById(resume.getJob().getId());
        if (jobOptional.isEmpty()) return false;

        return true;
    }

    @Override
    public CreateResumeResponse create(Resume resume) {
        resume = this.resumeRepository.save(resume);

        CreateResumeResponse res = new CreateResumeResponse();
        res.setId(resume.getId());
        res.setCreatedBy(resume.getCreatedBy());
        res.setCreatedAt(resume.getCreatedAt());

        return res;
    }

    @Override
    public UpdateResumeResponse update(UpdateResumeRequest resume) {
        Resume currentResume = this.resumeRepository.findById(resume.getId()).get();

        currentResume.setStatus(resume.getStatus());
        this.resumeRepository.save(currentResume);

        if (currentResume.getUser() != null && currentResume.getJob() != null) {
            String message = "Trạng thái CV của bạn cho vị trí " + currentResume.getJob().getName() + " đã chuyển thành: " + resume.getStatus().toString();
            Notification notification = new Notification();
            notification.setMessage(message);
            notification.setUser(currentResume.getUser());
            this.notificationRepository.save(notification);

            this.messagingTemplate.convertAndSend("/topic/notifications/" + currentResume.getUser().getId(), message);
        }

        UpdateResumeResponse response = new UpdateResumeResponse();
        response.setUpdatedAt(currentResume.getUpdatedAt());
        response.setUpdatedBy(currentResume.getUpdatedBy());
        return response;
    }

    @Override
    public FetchResumeResponse fetchById(long id) {
        Resume resume = this.resumeRepository.findById(id).get();

        FetchResumeResponse res = new FetchResumeResponse();
        res.setId(resume.getId());
        res.setEmail(resume.getEmail());
        res.setUrl(resume.getUrl());
        res.setStatus(resume.getStatus());
        res.setCreatedAt(resume.getCreatedAt());
        res.setCreatedBy(resume.getCreatedBy());
        res.setUpdatedAt(resume.getUpdatedAt());
        res.setUpdatedBy(resume.getUpdatedBy());

        if (resume.getJob() != null) {
            res.setCompanyName(resume.getJob().getCompany().getName());
        }

        res.setUser(new FetchResumeResponse.UserResume(
                        resume.getUser().getId(),
                        resume.getUser().getName())
        );
        res.setJob(new FetchResumeResponse.JobResume(
                        resume.getJob().getId(),
                        resume.getJob().getName())
        );

        return res;

    }

    @Override
    public void deleteById(long id) {
        this.resumeRepository.deleteById(id);
    }

    @Override
    public boolean checkExistById(long id) {
        return this.resumeRepository.existsById(id);
    }

    @Override
    public ResultPagination fetchAllResume(Specification<Resume> spec, Pageable pageable) {
        Page<Resume> pageResume = this.resumeRepository.findAll(spec, pageable);

        Meta meta = Meta.builder()
                .page(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .pages(pageResume.getTotalPages())
                .total(pageResume.getTotalElements())
                .build();

        List<FetchResumeResponse> pageResumeResponse = pageResume.getContent().stream()
                .map(item -> this.fetchById(item.getId())).toList();

        return ResultPagination.builder()
                .meta(meta)
                .result(pageResumeResponse)
                .build();
    }

    @Override
    public ResultPagination fetchResumeByUser(Pageable pageable) {
        // query builder
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        FilterNode node = filterParser.parse("email='" + email + "'");
        FilterSpecification<Resume> spec = filterSpecificationConverter.convert(
                node
        );
        Page<Resume> pageResume = this.resumeRepository.findAll(spec, pageable);

        ResultPagination rs = new ResultPagination();
        Meta mt = new Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageResume.getTotalPages());
        mt.setTotal(pageResume.getTotalElements());

        rs.setMeta(mt);

        // remove sensitive data
        List<FetchResumeResponse> listResume = pageResume
                .getContent()
                .stream()
                .map(item -> this.fetchById(item.getId()))
                .toList();

        rs.setResult(listResume);

        return rs;

    }

    @Override
    public AIMatchResponse getAIMatchScore(long id) {
        Resume resume = this.resumeRepository.findById(id).orElse(null);
        if (resume == null || resume.getJob() == null) {
            return new AIMatchResponse(0, "Không tìm thấy hồ sơ hoặc công việc tương ứng.");
        }
        
        String cvText = fileExtractionService.extractTextFromResume(resume.getUrl());
        if (cvText == null || cvText.isEmpty()) {
            return new AIMatchResponse(0, "Không thể đọc nội dung file CV.");
        }
        
        String jobDescription = resume.getJob().getDescription();
        if (resume.getJob().getSkills() != null) {
            List<String> skills = resume.getJob().getSkills().stream().map(s -> s.getName()).toList();
            jobDescription += "\nRequired Skills: " + String.join(", ", skills);
        }
        
        return geminiAIService.evaluateResumeMatch(cvText, jobDescription);
    }
}
