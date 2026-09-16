package thanhanh.job_recruitment.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.constant.GenderEnum;


import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "age")
    private int age;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;

    @Column(name = "address")
    private String address;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "refreshToken", columnDefinition = "MEDIUMTEXT")
    private String refreshToken;

    @Column(name = "createdAt")
    Instant createdAt;

    @Column(name = "updatedAt")
    Instant updatedAt;

    @Column(name = "createdBy")
    String createdBy;

    @Column(name = "updatedBy")
    String updatedBy;

    @ManyToOne
    @JoinColumn (name = "company_id")
    @JsonIgnoreProperties({"users", "jobs"})
    Company company;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Resume> resumes;

    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role;

    @PrePersist
    public void handleCreateUser() {
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get() : "";

        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleUpdateUser() {
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get() : "";

        this.updatedAt = Instant.now();
    }
}
