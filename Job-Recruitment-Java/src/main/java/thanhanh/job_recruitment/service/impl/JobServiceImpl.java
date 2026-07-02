package thanhanh.job_recruitment.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.domain.Skill;
import thanhanh.job_recruitment.dto.request.Job.CreateJobRequest;
import thanhanh.job_recruitment.dto.request.Job.UpdateJobRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.Meta;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Company.CompanyResponse;
import thanhanh.job_recruitment.dto.response.Job.JobResponse;
import thanhanh.job_recruitment.repository.CompanyRepository;
import thanhanh.job_recruitment.repository.JobRepository;
import thanhanh.job_recruitment.repository.SkillRepository;
import thanhanh.job_recruitment.service.JobService;
import thanhanh.job_recruitment.service.UserService;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.domain.Subscriber;
import thanhanh.job_recruitment.repository.SubscriberRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class JobServiceImpl implements JobService {
    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final CompanyRepository companyRepository;
    private final UserService userService;
    private final SubscriberRepository subscriberRepository;

    @Override
    public JobResponse createJob(CreateJobRequest request) {
        String email = thanhanh.job_recruitment.util.SecurityUtil.getCurrentUserLogin().isPresent()
                ? thanhanh.job_recruitment.util.SecurityUtil.getCurrentUserLogin().get()
                : "";
        if (!email.equals("admin@gmail.com") && !email.isEmpty()) {
            thanhanh.job_recruitment.domain.User currentUser = this.userService.fetchUserByEmail(email);
            if (currentUser != null && (currentUser.getCompany() == null ||
                    request.getCompany() == null ||
                    currentUser.getCompany().getId() != request.getCompany().getId())) {
                throw new thanhanh.job_recruitment.util.exception.PermissionException("Bạn chỉ có thể tạo việc làm cho công ty của mình!");
            }
        }

        List<Skill> listSkills = new ArrayList<>();
        // Check skills
        if (request.getSkills() != null) {
            List<Long> listSkillId = request.getSkills()
                    .stream().map(x -> x.getId()).toList();

            listSkills = this.skillRepository.findByIdIn(listSkillId);
        }

        // Check company
        Company company = new Company();
        if (request.getCompany() != null) {
            Optional<Company> companyOptional = this.companyRepository.findById(request.getCompany().getId());
            if (companyOptional.isPresent()) {
                company = companyOptional.get();
            }

        }

        Job newJob = Job.builder()
                .name(request.getName())
                .location(request.getLocation())
                .salary(request.getSalary())
                .quantity(request.getQuantity())
                .level(request.getLevel())
                .active(request.isActive())
                .description(request.getDescription())
                .company(company)
                .skills(listSkills)
                .build();

        this.jobRepository.save(newJob);

        return this.mapperJobToJobResponse(newJob);
    }

    @Override
    public JobResponse updateJob(UpdateJobRequest request) {
        Job currentJob = this.jobRepository.findById(request.getId()).get();

        String email = thanhanh.job_recruitment.util.SecurityUtil.getCurrentUserLogin().isPresent()
                ? thanhanh.job_recruitment.util.SecurityUtil.getCurrentUserLogin().get()
                : "";
        if (!email.equals("admin@gmail.com") && !email.isEmpty()) {
            thanhanh.job_recruitment.domain.User currentUser = this.userService.fetchUserByEmail(email);
            if (currentUser != null) {
                if (currentJob.getCompany() == null || currentUser.getCompany() == null ||
                        currentJob.getCompany().getId() != currentUser.getCompany().getId()) {
                    throw new thanhanh.job_recruitment.util.exception.PermissionException("Bạn chỉ có thể cập nhật việc làm của công ty mình!");
                }
                if (request.getCompany() == null ||
                        request.getCompany().getId() != currentUser.getCompany().getId()) {
                    throw new thanhanh.job_recruitment.util.exception.PermissionException("Bạn không thể thay đổi công ty của việc làm sang công ty khác!");
                }
            }
        }

        currentJob.setName(request.getName());
        currentJob.setLocation(request.getLocation());
        currentJob.setSalary(request.getSalary());
        currentJob.setQuantity(request.getQuantity());
        currentJob.setLevel(request.getLevel());
        currentJob.setActive(request.isActive());
        currentJob.setDescription(request.getDescription());
        currentJob.setStartDate(request.getStartDate());
        currentJob.setEndDate(request.getEndDate());
        // Check company
        Company company = null;
        if (request.getCompany() != null) {
            Optional<Company> companyOptional = this.companyRepository.findById(request.getCompany().getId());
            if (companyOptional.isPresent()) {
                company = companyOptional.get();
            }
        }
        currentJob.setCompany(company);

        // Check skills
        List<Skill> listSkills = new ArrayList<>();
        if (request.getSkills() != null) {
            List<Long> listSkillId = request.getSkills()
                    .stream().map(x -> x.getId()).toList();
            listSkills = this.skillRepository.findByIdIn(listSkillId);
        }
        currentJob.setSkills(listSkills);

        this.jobRepository.save(currentJob);

        return this.mapperJobToJobResponse(currentJob);
    }

    @Override
    public boolean checkExistsById(long id) {
        return this.jobRepository.existsById(id);
    }

    @Override
    public JobResponse fetchJobById(long id) {
        Job currentJob = this.jobRepository.findById(id).get();

        return this.mapperJobToJobResponse(currentJob);
    }

    @Override
    public ResultPagination fetchAllJob(Specification<Job> spec, Pageable pageable) {
        Page<Job> pageJob = this.jobRepository.findAll(spec, pageable);

        List<JobResponse> listJobResponse = pageJob.getContent().stream().map(job ->
                this.mapperJobToJobResponse(job)).toList();

        Meta meta = Meta.builder()
                .page(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .pages(pageJob.getTotalPages())
                .total(pageJob.getTotalElements())
                .build();

        return ResultPagination.builder()
                .meta(meta)
                .result(listJobResponse)
                .build();
    }

    @Override
    public void deleteJobById(long id) {
        String email = thanhanh.job_recruitment.util.SecurityUtil.getCurrentUserLogin().isPresent()
                ? thanhanh.job_recruitment.util.SecurityUtil.getCurrentUserLogin().get()
                : "";
        if (!email.equals("admin@gmail.com") && !email.isEmpty()) {
            thanhanh.job_recruitment.domain.User currentUser = this.userService.fetchUserByEmail(email);
            Job job = this.jobRepository.findById(id).orElse(null);
            if (currentUser != null && job != null) {
                if (job.getCompany() == null || currentUser.getCompany() == null ||
                        job.getCompany().getId() != currentUser.getCompany().getId()) {
                    throw new thanhanh.job_recruitment.util.exception.PermissionException("Bạn chỉ có thể xóa việc làm của công ty mình!");
                }
            }
        }
        this.jobRepository.deleteById(id);
    }

    private JobResponse mapperJobToJobResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .name(job.getName())
                .location(job.getLocation())
                .salary(job.getSalary())
                .quantity(job.getQuantity())
                .level(job.getLevel())
                .active(job.isActive())
                .description(job.getDescription())
                .startDate(job.getStartDate())
                .endDate(job.getEndDate())
                .company(job.getCompany() != null ? this.mapperCompanyToCompanyResponse(job.getCompany()) : null)
                .skills(job.getSkills())
                .createdAt(job.getCreatedAt())
                .createBy(job.getCreatedBy())
                .updatedAt(job.getUpdatedAt())
                .updatedBy(job.getUpdatedBy())
                .compatibilityScore(calculateCompatibilityScore(job))
                .build();
    }

    private CompanyResponse mapperCompanyToCompanyResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .address(company.getAddress())
                .description(company.getDescription())
                .logo(company.getLogo())
                .createBy(company.getCreatedBy())
                .createdAt(company.getCreatedAt())
                .updatedBy(company.getUpdatedBy())
                .updatedAt(company.getUpdatedAt())
                .build();
    }

    private int calculateCompatibilityScore(Job job) {
        String email = thanhanh.job_recruitment.util.SecurityUtil.getCurrentUserLogin().orElse(null);
        if (email == null || email.isEmpty() || email.equals("admin@gmail.com")) {
            return 0;
        }

        Optional<Subscriber> subscriberOpt = this.subscriberRepository.findByEmail(email);
        if (subscriberOpt.isEmpty()) {
            return 0;
        }

        List<Skill> userSkills = subscriberOpt.get().getSkills();
        List<Skill> jobSkills = job.getSkills();

        if (userSkills == null || userSkills.isEmpty() || jobSkills == null || jobSkills.isEmpty()) {
            return 0;
        }

        long intersectionCount = userSkills.stream()
                .filter(us -> jobSkills.stream().anyMatch(js -> js.getId() == us.getId()))
                .count();

        long unionCount = jobSkills.size() + userSkills.size() - intersectionCount;

        if (unionCount == 0) return 0;

        return (int) Math.round(((double) intersectionCount / unionCount) * 100);
    }
}
