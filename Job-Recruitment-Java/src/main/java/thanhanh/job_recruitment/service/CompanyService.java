package thanhanh.job_recruitment.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.dto.request.Company.CompanyRequest;
import thanhanh.job_recruitment.dto.response.Company.CompanyResponse;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;

public interface CompanyService {
    CompanyResponse createCompany (CompanyRequest companyRequest);
    ResultPagination fetchAllCompany (Specification<Company> spec, Pageable pageable);
    CompanyResponse updateCompany (Company company);
    void deleteCompany (long id);
    CompanyResponse fetchCompanyById (long id);
    boolean checkExistById (long id);
}
