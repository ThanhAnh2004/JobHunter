package thanhanh.job_recruitment.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import thanhanh.job_recruitment.util.SecurityUtil;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties({"password", "refreshToken", "resumes"})
    private User candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    @JsonIgnoreProperties({"users", "jobs"})
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties({"company", "skills"})
    private Job job;

    @Column(name = "last_message", columnDefinition = "TEXT")
    private String lastMessage;

    @Column(name = "last_message_at")
    private Instant lastMessageAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_sender_id")
    @JsonIgnore
    private User lastSender;

    @Column(name = "unread_candidate")
    @Builder.Default
    private int unreadCandidate = 0;

    @Column(name = "unread_hr")
    @Builder.Default
    private int unreadHr = 0;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ChatMessage> messages;

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
        this.updatedAt = Instant.now();
        if (this.lastMessageAt == null) {
            this.lastMessageAt = Instant.now();
        }
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse("");
        this.updatedAt = Instant.now();
    }
}
