package thanhanh.job_recruitment.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import thanhanh.job_recruitment.domain.InterviewSchedule;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.domain.Notification;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.dto.request.Interview.CandidateRespondInterviewRequest;
import thanhanh.job_recruitment.dto.request.Interview.CreateInterviewRequest;
import thanhanh.job_recruitment.dto.request.Interview.UpdateInterviewRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.Meta;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.repository.InterviewScheduleRepository;
import thanhanh.job_recruitment.repository.JobRepository;
import thanhanh.job_recruitment.repository.NotificationRepository;
import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.service.EmailService;
import thanhanh.job_recruitment.service.InterviewScheduleService;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.constant.InterviewStateEnum;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.util.exception.PermissionException;

import java.util.List;
import java.util.Optional;

@Service
public class InterviewScheduleServiceImpl implements InterviewScheduleService {

    private final InterviewScheduleRepository interviewScheduleRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;

    public InterviewScheduleServiceImpl(InterviewScheduleRepository interviewScheduleRepository, UserRepository userRepository, JobRepository jobRepository, NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate, EmailService emailService) {
        this.interviewScheduleRepository = interviewScheduleRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.emailService = emailService;
    }

    @Override
    public InterviewSchedule create(CreateInterviewRequest request) throws IdInvalidException {
        Optional<User> candidateOpt = this.userRepository.findById(request.getCandidateId());
        if (candidateOpt.isEmpty()) {
            throw new IdInvalidException("Candidate not found");
        }
        Optional<Job> jobOpt = this.jobRepository.findById(request.getJobId());
        if (jobOpt.isEmpty()) {
            throw new IdInvalidException("Job not found");
        }

        InterviewSchedule schedule = new InterviewSchedule();
        schedule.setTitle(request.getTitle());
        schedule.setInterviewTime(request.getInterviewTime());
        schedule.setLocation(request.getLocation());
        schedule.setCandidate(candidateOpt.get());
        schedule.setJob(jobOpt.get());

        schedule = this.interviewScheduleRepository.save(schedule);

        // Send Notification & Email
        sendInterviewNotification(schedule, "Bạn có một lịch phỏng vấn mới: " + schedule.getTitle());

        return schedule;
    }

    @Override
    public InterviewSchedule update(UpdateInterviewRequest request) throws IdInvalidException {
        Optional<InterviewSchedule> scheduleOpt = this.interviewScheduleRepository.findById(request.getId());
        if (scheduleOpt.isEmpty()) {
            throw new IdInvalidException("Interview Schedule not found");
        }

        InterviewSchedule schedule = scheduleOpt.get();
        if (request.getTitle() != null) schedule.setTitle(request.getTitle());
        if (request.getInterviewTime() != null) schedule.setInterviewTime(request.getInterviewTime());
        if (request.getLocation() != null) schedule.setLocation(request.getLocation());
        if (request.getStatus() != null) schedule.setStatus(request.getStatus());

        schedule = this.interviewScheduleRepository.save(schedule);

        sendInterviewNotification(schedule, "Lịch phỏng vấn của bạn đã được cập nhật: " + schedule.getTitle());

        return schedule;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public InterviewSchedule candidateRespond(CandidateRespondInterviewRequest request) throws IdInvalidException, PermissionException {
        Optional<InterviewSchedule> scheduleOpt = this.interviewScheduleRepository.findById(request.getId());
        if (scheduleOpt.isEmpty()) {
            throw new IdInvalidException("Không tìm thấy lịch phỏng vấn");
        }

        InterviewSchedule schedule = scheduleOpt.get();

        // Verify that the current user is the candidate of this interview
        String currentEmail = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(currentEmail).orElse(null);
        boolean isOwner = false;
        if (currentUser != null && schedule.getCandidate() != null) {
            if (schedule.getCandidate().getId() == currentUser.getId()) {
                isOwner = true;
            }
            if (schedule.getCandidate().getEmail() != null && schedule.getCandidate().getEmail().equalsIgnoreCase(currentEmail)) {
                isOwner = true;
            }
        }
        if (!isOwner) {
            throw new PermissionException("Bạn không có quyền thực hiện hành động này");
        }

        // Update status if provided
        if (request.getStatus() != null) {
            if (request.getStatus() != InterviewStateEnum.ACCEPTED && request.getStatus() != InterviewStateEnum.REJECTED) {
                throw new PermissionException("Ứng viên chỉ có thể chọn ACCEPTED hoặc REJECTED");
            }
            schedule.setStatus(request.getStatus());
        }

        // Update candidate note if provided
        if (request.getCandidateNote() != null) {
            schedule.setCandidateNote(request.getCandidateNote());
        }

        schedule = this.interviewScheduleRepository.save(schedule);

        // Notify HR (via job company) about candidate's response
        notifyHRAboutCandidateResponse(schedule);

        return schedule;
    }

    /**
     * Notify HR members of the company about candidate's response
     */
    private void notifyHRAboutCandidateResponse(InterviewSchedule schedule) {
        if (schedule.getJob() == null || schedule.getJob().getCompany() == null) return;

        String candidateName = schedule.getCandidate() != null ? schedule.getCandidate().getName() : "Ứng viên";
        String statusText = schedule.getStatus() == InterviewStateEnum.ACCEPTED ? "đã đồng ý" : "đã từ chối";
        String msg = candidateName + " " + statusText + " lịch phỏng vấn: " + schedule.getTitle();

        if (schedule.getCandidateNote() != null && !schedule.getCandidateNote().isBlank()) {
            msg += " | Ghi chú: " + schedule.getCandidateNote();
        }

        // Send WebSocket to all HR of the company
        List<User> hrUsers = schedule.getJob().getCompany().getUsers();
        if (hrUsers != null) {
            for (User hr : hrUsers) {
                // Save to DB notification
                Notification notification = new Notification();
                notification.setMessage(msg);
                notification.setUser(hr);
                this.notificationRepository.save(notification);

                // WebSocket push
                this.messagingTemplate.convertAndSend("/topic/notifications/" + hr.getId(), msg);
            }
        }
    }

    @Override
    public void delete(long id) throws IdInvalidException {
        Optional<InterviewSchedule> scheduleOpt = this.interviewScheduleRepository.findById(id);
        if (scheduleOpt.isEmpty()) {
            throw new IdInvalidException("Interview Schedule not found");
        }
        this.interviewScheduleRepository.deleteById(id);
    }

    @Override
    public InterviewSchedule fetchById(long id) throws IdInvalidException {
        Optional<InterviewSchedule> scheduleOpt = this.interviewScheduleRepository.findById(id);
        if (scheduleOpt.isEmpty()) {
            throw new IdInvalidException("Interview Schedule not found");
        }
        return scheduleOpt.get();
    }

    @Override
    public ResultPagination fetchAll(Specification<InterviewSchedule> spec, Pageable pageable) {
        Page<InterviewSchedule> page = this.interviewScheduleRepository.findAll(spec, pageable);
        Meta meta = Meta.builder()
                .page(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .pages(page.getTotalPages())
                .total(page.getTotalElements())
                .build();
        return ResultPagination.builder()
                .meta(meta)
                .result(page.getContent())
                .build();
    }

    private void sendInterviewNotification(InterviewSchedule schedule, String messageTitle) {
        if (schedule.getCandidate() != null) {
            // DB Notification
            Notification notification = new Notification();
            notification.setMessage(messageTitle);
            notification.setUser(schedule.getCandidate());
            this.notificationRepository.save(notification);

            // WebSocket
            this.messagingTemplate.convertAndSend("/topic/notifications/" + schedule.getCandidate().getId(), messageTitle);

            // Email
            try {
                String jobName = schedule.getJob() != null ? schedule.getJob().getName() : "Không xác định";
                String companyName = (schedule.getJob() != null && schedule.getJob().getCompany() != null) 
                        ? schedule.getJob().getCompany().getName() : "Nhà tuyển dụng";
                String formattedTime = schedule.getInterviewTime() != null 
                        ? java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                            .withZone(java.time.ZoneId.of("Asia/Ho_Chi_Minh"))
                            .format(schedule.getInterviewTime())
                        : "Chưa xác định";

                String emailContent = "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">"
                        + "<h2 style=\"color: #2563eb;\">" + messageTitle + "</h2>"
                        + "<p>Xin chào <strong>" + schedule.getCandidate().getName() + "</strong>,</p>"
                        + "<p>Bạn đã nhận được lịch phỏng vấn với thông tin chi tiết như sau:</p>"
                        + "<table style=\"border-collapse: collapse; width: 100%; max-width: 500px; margin: 16px 0;\">"
                        + "<tr><td style=\"padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;\">Công ty:</td><td style=\"padding: 8px; border: 1px solid #e2e8f0;\">" + companyName + "</td></tr>"
                        + "<tr><td style=\"padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;\">Vị trí ứng tuyển:</td><td style=\"padding: 8px; border: 1px solid #e2e8f0;\">" + jobName + "</td></tr>"
                        + "<tr><td style=\"padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;\">Thời gian:</td><td style=\"padding: 8px; border: 1px solid #e2e8f0;\">" + formattedTime + "</td></tr>"
                        + "<tr><td style=\"padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;\">Địa điểm / Link họp:</td><td style=\"padding: 8px; border: 1px solid #e2e8f0;\">" + schedule.getLocation() + "</td></tr>"
                        + "</table>"
                        + "<p>Vui lòng đăng nhập vào hệ thống để xác nhận tham gia hoặc gửi ghi chú phản hồi cho nhà tuyển dụng.</p>"
                        + "<p>Trân trọng,<br/><strong>" + companyName + "</strong></p>"
                        + "</div>";

                this.emailService.sendEmailSync(schedule.getCandidate().getEmail(), "Thông báo lịch phỏng vấn: " + schedule.getTitle(), emailContent, false, true);
            } catch (Exception e) {
                System.err.println(">>> Error sending interview email notification: " + e.getMessage());
            }
        }
    }
}

