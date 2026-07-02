package thanhanh.job_recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import thanhanh.job_recruitment.domain.Resume;

import thanhanh.job_recruitment.util.constant.ResumeStateEnum;

import thanhanh.job_recruitment.domain.Company;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long>, JpaSpecificationExecutor<Resume> {
    boolean existsById(long id);
    long countByStatus(ResumeStateEnum status);
    long countByJobCompany(Company company);
    long countByJobCompanyAndStatus(Company company, ResumeStateEnum status);
}
