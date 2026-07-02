package thanhanh.job_recruitment.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import thanhanh.job_recruitment.domain.Permission;
import thanhanh.job_recruitment.dto.request.Permission.CreatePermissionRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.Meta;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Permission.PermissionResponse;
import thanhanh.job_recruitment.repository.PermissionRepository;
import thanhanh.job_recruitment.service.PermissionService;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public PermissionResponse createPermission(CreatePermissionRequest request) {
        Permission newPermission = Permission.builder()
                .name(request.getName())
                .apiPath(request.getApiPath())
                .method(request.getMethod())
                .module(request.getModule())
                .build();

        this.permissionRepository.save(newPermission);

        return this.mapperPermissionToPermissionResponse(newPermission);
    }

    @Override
    public PermissionResponse updatePermission(Permission permission) {
        Permission currentPermission = this.permissionRepository.findById(permission.getId()).get();

        currentPermission.setName(permission.getName());
        currentPermission.setApiPath(permission.getApiPath());
        currentPermission.setMethod(permission.getMethod());
        currentPermission.setModule(permission.getModule());

        this.permissionRepository.save(currentPermission);

        return this.mapperPermissionToPermissionResponse(currentPermission);
    }

    @Override
    public ResultPagination fetchAllPermission(Specification<Permission> spec, Pageable pageable) {
        Page<Permission> pagePermissions = this.permissionRepository.findAll(spec, pageable);

        List<PermissionResponse> listPermissionResponse = pagePermissions.getContent().stream()
                .map(item -> mapperPermissionToPermissionResponse(item)).toList();

        Meta meta = Meta.builder()
                .page(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .pages(pagePermissions.getTotalPages())
                .total(pagePermissions.getTotalElements())
                .build();

        return ResultPagination.builder()
                .meta(meta)
                .result(listPermissionResponse)
                .build();
    }

    @Override
    public boolean checkExistById(long id) {
        return this.permissionRepository.existsById(id);
    }

    @Override
    public void deletePermission(long id) {
        // Delete a permission_role
        Optional<Permission> permissionOptional = this.permissionRepository.findById(id);

            Permission currentPermission = permissionOptional.get();
            currentPermission.getRoles().forEach(role -> role.getPermissions().remove(currentPermission));

        this.permissionRepository.delete(currentPermission);

    }

    @Override
    public boolean isPermissionExist(Permission permission) {
        return permissionRepository.existsByModuleAndApiPathAndMethod(
                permission.getModule(),
                permission.getApiPath(),
                permission.getMethod());
    }

    private PermissionResponse mapperPermissionToPermissionResponse(Permission permission){
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .apiPath(permission.getApiPath())
                .method(permission.getMethod())
                .module(permission.getModule())
                .createdAt(permission.getCreatedAt())
                .createBy(permission.getCreatedBy())
                .updatedAt(permission.getUpdatedAt())
                .updatedBy(permission.getUpdatedBy())
                .build();
    }
}
