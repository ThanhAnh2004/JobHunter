package thanhanh.job_recruitment.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import thanhanh.job_recruitment.domain.Permission;
import thanhanh.job_recruitment.dto.request.Permission.CreatePermissionRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Permission.PermissionResponse;

public interface PermissionService {
    PermissionResponse createPermission(CreatePermissionRequest request);
    PermissionResponse updatePermission(Permission permission);
    ResultPagination fetchAllPermission(Specification<Permission> spec, Pageable pageable);
    boolean checkExistById(long id);
    void deletePermission(long id);
    boolean isPermissionExist(Permission permission);
}
