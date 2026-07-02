package thanhanh.job_recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.domain.Skill;

import java.util.List;

import thanhanh.job_recruitment.domain.Company;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    boolean existsById(long id);
    List<Job> findBySkillsIn(List<Skill> skills);
    long countByCompany(Company company);
}
