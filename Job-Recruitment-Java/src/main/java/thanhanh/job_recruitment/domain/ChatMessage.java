package thanhanh.job_recruitment.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    @JsonIgnore
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonIgnoreProperties({"password", "refreshToken", "resumes"})
    private User sender;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "type")
    @Builder.Default
    private String type = "TEXT";

    @Column(name = "is_read")
    @Builder.Default
    private boolean isRead = false;

    @Column(name = "created_at")
    private Instant createdAt;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }
}
