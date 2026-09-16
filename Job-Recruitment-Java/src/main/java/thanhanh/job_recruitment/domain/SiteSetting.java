package thanhanh.job_recruitment.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
public class SiteSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "key_name", nullable = false, unique = true)
    private String keyName;

    @Column(name = "value", columnDefinition = "LONGTEXT")
    private String value;

    @Column(name = "description")
    private String description;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
    }
}
