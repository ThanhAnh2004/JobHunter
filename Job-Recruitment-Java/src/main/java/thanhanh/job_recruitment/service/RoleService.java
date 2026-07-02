package thanhanh.job_recruitment.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import thanhanh.job_recruitment.domain.Role;
import thanhanh.job_recruitment.dto.request.Role.CreateRoleRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Role.RoleResponse;

public interface RoleService {
    RoleResponse createRole(CreateRoleRequest request);
    RoleResponse updateRole(Role role);
    RoleResponse fetchRoleById (long id);
    ResultPagination fetchAllRole(Specification<Role> spec, Pageable pageable);
    boolean checkExitsById(long id);
    void deleteRole(long id);
}
