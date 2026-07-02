package thanhanh.job_recruitment.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.constant.InterviewStateEnum;

import java.time.Instant;

@Entity
@Table(name = "interview_schedules")
@Getter
@Setter
public class InterviewSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "interview_time")
    private Instant interviewTime;

    @Column(name = "location")
    private String location;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private InterviewStateEnum status = InterviewStateEnum.SCHEDULED;

    /**
     * Ghi chú / Đề xuất của ứng viên
     */
    @Column(name = "candidate_note", columnDefinition = "TEXT")
    private String candidateNote;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties({"resumes", "company", "role", "password"})
    private User candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties({"resumes", "skills"})
    private Job job;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdBy = SecurityUtil.getCurrentUserLogin().orElse("");
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse("");
        this.updatedAt = Instant.now();
    }
}
