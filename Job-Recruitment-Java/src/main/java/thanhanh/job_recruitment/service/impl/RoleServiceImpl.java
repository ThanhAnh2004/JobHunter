package thanhanh.job_recruitment.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import thanhanh.job_recruitment.domain.Permission;
import thanhanh.job_recruitment.domain.Role;
import thanhanh.job_recruitment.dto.request.Role.CreateRoleRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.Meta;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Role.RoleResponse;
import thanhanh.job_recruitment.repository.PermissionRepository;
import thanhanh.job_recruitment.repository.RoleRepository;
import thanhanh.job_recruitment.service.RoleService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public RoleResponse createRole(CreateRoleRequest request) {
        List<Permission> listPermission = new ArrayList<>();

        if (request.getPermissions() != null) {
            List<Long> listPermissionId = request.getPermissions().stream()
                    .map(x -> x.getId()).toList();

            listPermission = this.permissionRepository.findByIdIn(listPermissionId);
        }

        Role newRole = Role.builder()
                .name(request.getName())
                .permissions(request.getPermissions())
                .active(request.isActive())
                .description(request.getDescription())
                .permissions(listPermission)
                .build();
        this.roleRepository.save(newRole);

        return this.mapperRoleToRoleResponse(newRole);
    }

    @Override
    public RoleResponse updateRole(Role role) {
        Role currentRole = this.roleRepository.findById(role.getId()).get();

        currentRole.setName(role.getName());
        currentRole.setDescription(role.getDescription());
        currentRole.setActive(role.isActive());

        List<Permission> listPermission = new ArrayList<>();
        if (role.getPermissions() != null) {
            List<Long> listPermissionId = role.getPermissions().stream()
                    .map(x -> x.getId()).toList();
            listPermission = this.permissionRepository.findByIdIn(listPermissionId);
        }
        currentRole.setPermissions(listPermission);

        this.roleRepository.save(currentRole);

        return this.mapperRoleToRoleResponse(currentRole);

    }

    @Override
    public RoleResponse fetchRoleById(long id) {
        Role currentRole = this.roleRepository.findById(id).get();


        return this.mapperRoleToRoleResponse(currentRole);
    }

    @Override
    public ResultPagination fetchAllRole(Specification<Role> spec, Pageable pageable) {
        Page<Role> pageRole = this.roleRepository.findAll(spec, pageable);

        List<RoleResponse> listRoleResponse = pageRole.getContent().stream().map(role ->
                this.mapperRoleToRoleResponse(role)).toList();

        Meta meta = Meta.builder()
                .page(pageable.getPageNumber()  + 1)
                .pageSize(pageable.getPageSize())
                .pages(pageRole.getTotalPages())
                .total(pageRole.getTotalElements())
                .build();

        return ResultPagination.builder()
                .meta(meta)
                .result(listRoleResponse)
                .build();
    }

    @Override
    public boolean checkExitsById(long id) {
        return this.roleRepository.existsById(id);
    }

    @Override
    public void deleteRole(long id) {
        Optional<Role> roleOptional = this.roleRepository.findById(id);

        if(roleOptional.isPresent()){
            Role currentRole = roleOptional.get();
            this.roleRepository.delete(currentRole);
        }
    }

    private RoleResponse mapperRoleToRoleResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .active(role.isActive())
                .permissions(role.getPermissions())
                .createdAt(role.getCreatedAt())
                .createdBy(role.getCreatedBy())
                .updatedAt(role.getUpdatedAt())
                .updatedBy(role.getUpdatedBy())
                .build();
    }
}
