package thanhanh.job_recruitment.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.dto.request.User.UpdateUserRequest;
import thanhanh.job_recruitment.dto.request.User.UserRequest;
import thanhanh.job_recruitment.dto.response.ApiResponse.ResultPagination;
import thanhanh.job_recruitment.dto.response.User.UserResponse;
import thanhanh.job_recruitment.service.UserService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.util.exception.PermissionException;

import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.util.SecurityUtil;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;
    UserRepository userRepository;

    @PostMapping
    @ApiMessage("Create a new user")
    public ResponseEntity<UserResponse> createUser (@Valid @RequestBody UserRequest user) throws IdInvalidException, PermissionException {
        // Check email exists
        boolean checkEmail = this.userService.existsByEmail(user.getEmail());
        if (checkEmail) {
            throw new IdInvalidException("Email " + user.getEmail() + " has existed");
        }

        // Check company scope
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            if (currentUser == null || currentUser.getCompany() == null || user.getCompany() == null || currentUser.getCompany().getId() != user.getCompany().getId()) {
                throw new PermissionException("Bạn chỉ được phép tạo người dùng thuộc công ty của mình.");
            }
        }

        UserResponse newUser = this.userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a user")
    public ResponseEntity<Void> deleteUser (@PathVariable("id") long id) throws IdInvalidException, PermissionException {
        boolean checkId = this.userService.existsById(id);
        if (!checkId) {
            throw new IdInvalidException("Not found user with id: " + id);
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            User targetUser = this.userRepository.findById(id).orElse(null);
            if (currentUser == null || targetUser == null || currentUser.getCompany() == null || targetUser.getCompany() == null || currentUser.getCompany().getId() != targetUser.getCompany().getId()) {
                throw new PermissionException("Bạn chỉ được phép xóa người dùng thuộc công ty của mình.");
            }
        }

        this.userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @ApiMessage("Fetch a user")
    public ResponseEntity<UserResponse> fetchUserById (@PathVariable("id") long id) throws IdInvalidException, PermissionException {
        boolean checkId = this.userService.existsById(id);
        if (!checkId) {
            throw new IdInvalidException("Not found user with id: " + id);
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            User targetUser = this.userRepository.findById(id).orElse(null);
            if (currentUser == null || targetUser == null || 
                (currentUser.getId() != targetUser.getId() && 
                 (currentUser.getCompany() == null || targetUser.getCompany() == null || 
                  currentUser.getCompany().getId() != targetUser.getCompany().getId()))) {
                throw new PermissionException("Bạn không quyền xem thông tin người dùng này.");
            }
        }

        UserResponse user = this.userService.fetchUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping
    @ApiMessage("Fetch all user")
    public ResponseEntity<ResultPagination> fetchAllUser (
            @Filter Specification<User> spec,
            Pageable pageable
            ) {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin && currentUser != null && currentUser.getCompany() != null) {
            Specification<User> companySpec = (root, query, cb) -> cb.equal(root.get("company"), currentUser.getCompany());
            spec = spec == null ? companySpec : spec.and(companySpec);
        }

        return ResponseEntity.status(HttpStatus.OK).body(this.userService.fetchAllUser(spec, pageable)) ;
    }

    @PutMapping
    @ApiMessage("Update a user")
    public ResponseEntity<UserResponse> updateUser (@Valid @RequestBody UpdateUserRequest user) throws IdInvalidException, PermissionException {
        boolean checkId = this.userService.existsById(user.getId());
        if (!checkId) {
            throw new IdInvalidException("Not found user with id: " + user.getId());
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email).orElse(null);
        boolean isSuperAdmin = email.equals("admin@gmail.com") || 
            (currentUser != null && currentUser.getRole() != null && currentUser.getRole().getName().equals("SUPER_ADMIN"));

        if (!isSuperAdmin) {
            User targetUser = this.userRepository.findById(user.getId()).orElse(null);
            if (currentUser == null || targetUser == null) {
                throw new PermissionException("Không tìm thấy thông tin người dùng.");
            }
            if (currentUser.getCompany() == null) {
                if (currentUser.getId() != user.getId()) {
                    throw new PermissionException("Bạn không có quyền cập nhật thông tin của tài khoản khác!");
                }
            } else {
                if (targetUser.getCompany() == null || currentUser.getCompany().getId() != targetUser.getCompany().getId()) {
                    throw new PermissionException("Bạn chỉ được phép cập nhật người dùng thuộc công ty của mình.");
                }
                if (user.getCompany() == null || currentUser.getCompany().getId() != user.getCompany().getId()) {
                    throw new PermissionException("Bạn không thể thay đổi công ty của người dùng sang công ty khác.");
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(this.userService.updateUser(user));
    }
}
