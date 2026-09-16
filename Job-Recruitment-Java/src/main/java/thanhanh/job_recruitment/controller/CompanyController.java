package thanhanh.job_recruitment.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.dto.request.Company.CompanyRequest;
import thanhanh.job_recruitment.dto.response.Company.CompanyResponse;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.service.CompanyService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.util.exception.PermissionException;
import thanhanh.job_recruitment.util.SecurityUtil;


@RestController
@RequestMapping("/api/v1/companies")
@AllArgsConstructor
public class CompanyController {
    private final CompanyService companyService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany (@Valid @RequestBody CompanyRequest companyRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.companyService.createCompany(companyRequest));
    }

    @GetMapping("{id}")
    @ApiMessage("Fetch a company by id")
    public ResponseEntity<CompanyResponse> fetchCompanyById(@PathVariable("id") long id) throws IdInvalidException {
        boolean checkExist = this.companyService.checkExistById(id);

        if (!checkExist) {
            throw new IdInvalidException("Not found company with id " + id);
        }

        return ResponseEntity.ok().body(this.companyService.fetchCompanyById(id));
    }

    @GetMapping()
    @ApiMessage("Fetch all company")
    public  ResponseEntity<ResultPagination> fetchAllCompany (
            @Filter Specification<Company> spec,
            Pageable pageable
            )  {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && "SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName()));
        boolean isHR = currentUser != null && currentUser.getRole() != null && "HR".equalsIgnoreCase(currentUser.getRole().getName());

        if (!isSuperAdmin && isHR && currentUser.getCompany() != null) {
            Specification<Company> companySpec = (root, query, cb) -> cb.equal(root.get("id"), currentUser.getCompany().getId());
            spec = spec == null ? companySpec : spec.and(companySpec);
        }

        return ResponseEntity.ok().body(this.companyService.fetchAllCompany(spec, pageable));
    }

    @PutMapping
    ResponseEntity<CompanyResponse> updateCompany(@RequestBody Company company) throws PermissionException {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            if (currentUser == null || currentUser.getCompany() == null || currentUser.getCompany().getId() != company.getId()) {
                throw new PermissionException("Bạn chỉ được phép cập nhật thông tin công ty của mình.");
            }
        }
        return ResponseEntity.ok().body(this.companyService.updateCompany(company));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteCompany (@PathVariable("id") long id) throws PermissionException {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            if (currentUser == null || currentUser.getCompany() == null || currentUser.getCompany().getId() != id) {
                throw new PermissionException("Bạn chỉ được phép xóa công ty của mình.");
            }
        }
        this.companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}
