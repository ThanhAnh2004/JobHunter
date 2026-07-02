package thanhanh.job_recruitment.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.Role;
import thanhanh.job_recruitment.dto.request.Role.CreateRoleRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.Role.RoleResponse;
import thanhanh.job_recruitment.service.RoleService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;

@RestController
@RequestMapping("/api/v1/roles")
@AllArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @ApiMessage("Create a new role")
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody CreateRoleRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.createRole(request));
    }

    @PutMapping
    @ApiMessage("Update a role")
    public ResponseEntity<RoleResponse> updateRole(@RequestBody Role role) throws IdInvalidException {
        // Check exists
        boolean existRole = this.roleService.checkExitsById(role.getId());

        if (!existRole) {
            throw new IdInvalidException("Not found role with id "+ role.getId());
        }
        return ResponseEntity.ok().body(this.roleService.updateRole(role));
    }

    @GetMapping("{id}")
    @ApiMessage("Fetch role by id")
    public ResponseEntity<RoleResponse> fetchRoleById(@PathVariable("id") long id) throws IdInvalidException {
        // Check exists
        boolean existRole = this.roleService.checkExitsById(id);

        if (!existRole) {
            throw new IdInvalidException("Not found role with id "+ id);
        }

        return ResponseEntity.ok().body(this.roleService.fetchRoleById(id));
    }

    @GetMapping
    @ApiMessage("Fetch all role")
    public ResponseEntity<ResultPagination> fetchAllRole(
            @Filter Specification<Role> spec,
            Pageable pageable
            ) {
        return ResponseEntity.ok().body(this.roleService.fetchAllRole(spec, pageable));
    }

    @DeleteMapping("{id}")
    @ApiMessage("Delete a role")
    public ResponseEntity<Void> deleteRole (@PathVariable("id") long id) throws IdInvalidException {
        // Check exists
        boolean existRole = this.roleService.checkExitsById(id);

        if (!existRole) {
            throw new IdInvalidException("Not found role with id "+ id);
        }

        this.roleService.deleteRole(id);

        return ResponseEntity.noContent().build();
    }
}
