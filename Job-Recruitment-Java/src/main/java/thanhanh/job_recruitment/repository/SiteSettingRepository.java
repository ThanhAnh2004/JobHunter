package thanhanh.job_recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import thanhanh.job_recruitment.domain.SiteSetting;

import java.util.Optional;

@Repository
public interface SiteSettingRepository extends JpaRepository<SiteSetting, Long> {
    Optional<SiteSetting> findByKeyName(String keyName);
    boolean existsByKeyName(String keyName);
}
