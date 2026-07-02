package thanhanh.job_recruitment.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.Permission;
import thanhanh.job_recruitment.dto.request.Permission.CreatePermissionRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Permission.PermissionResponse;
import thanhanh.job_recruitment.service.PermissionService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;

@RestController
@RequestMapping("/api/v1/permissions")
@AllArgsConstructor
public class PermissionController {
    public final PermissionService permissionService;

    @PostMapping
    @ApiMessage("Create a permission")
    public ResponseEntity<PermissionResponse> createPermission(@Valid @RequestBody CreatePermissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.permissionService.createPermission(request));
    }

    @PutMapping
    @ApiMessage("Update a permission")
    public ResponseEntity<PermissionResponse> updatePermission(@RequestBody Permission permission) throws IdInvalidException{
        // Check exist
        boolean existPermission = this.permissionService.checkExistById(permission.getId());

        if(!existPermission) {
            throw new IdInvalidException("Not found permission with id "+ permission.getId());
        }

        // check exist by module, apiPath and method
        if (this.permissionService.isPermissionExist(permission)) {
            throw new IdInvalidException("Permission has existed.");
        }

        return ResponseEntity.ok().body(this.permissionService.updatePermission(permission));
    }

    @GetMapping
    @ApiMessage("Fetch all permission")
    public ResponseEntity<ResultPagination> fetchAllPermission(
            @Filter Specification<Permission> spec,
            Pageable pageable
            ) {
        return ResponseEntity.ok().body(this.permissionService.fetchAllPermission(spec, pageable));
    }

    @DeleteMapping("{id}")
    @ApiMessage("Delete a permission")
    public ResponseEntity<Void> deletePermission(@PathVariable("id") long id) throws IdInvalidException{
        // Check exist
        boolean existPermission = this.permissionService.checkExistById(id);

        if(!existPermission) {
            throw new IdInvalidException("Not found permission with id "+ id);
        }

        this.permissionService.deletePermission(id);

        return ResponseEntity.noContent().build();
    }

}
