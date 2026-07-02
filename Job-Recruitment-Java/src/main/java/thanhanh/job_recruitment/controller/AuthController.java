package thanhanh.job_recruitment.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.dto.request.Auth.ChangePasswordRequest;
import thanhanh.job_recruitment.dto.request.Auth.LoginRequest;
import thanhanh.job_recruitment.dto.request.User.UserRequest;
import thanhanh.job_recruitment.dto.response.Auth.LoginResponse;
import thanhanh.job_recruitment.dto.response.Auth.UserLoginResponse;
import thanhanh.job_recruitment.dto.response.User.UserResponse;
import thanhanh.job_recruitment.service.UserService;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;

@RestController
@RequestMapping("/api/v1/auth")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class AuthController {

    AuthenticationManagerBuilder authenticationManagerBuilder;
    SecurityUtil securityUtil;
    UserService userService;
    PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${jwt.refresh-token-validity-in-seconds}")
    long refreshTokenExpiration;

    @NonFinal
    @Value("${app.cookie.secure:false}")
    boolean secureCookie;

    @PostMapping("/login")
    @ApiMessage("Login success")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {

        // add input include username/password into Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getUserName(),
                loginRequest.getPassword()
        );

        // authenticate user => write function loadUserByUsername
        Authentication authentication = authenticationManagerBuilder
                .getObject()
                .authenticate(authenticationToken);

        User currentUser = this.userService.fetchUserByEmail(loginRequest.getUserName());
        UserLoginResponse user = new UserLoginResponse();

        if (currentUser != null) {
            user = UserLoginResponse.builder()
                    .id(currentUser.getId())
                    .email(currentUser.getEmail())
                    .name(currentUser.getName())
                    .role(currentUser.getRole())
                    .build();
        }

        LoginResponse response = new LoginResponse();
        response.setUser(user);

        // set user information log into context (will maybe use)
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = this.securityUtil.createAccessToken(authentication.getName(), response);
        String refreshToken = this.securityUtil.createRefreshToken(loginRequest.getUserName(), response);

        response.setAccessToken(accessToken);

        // Update refresh token into database
        this.userService.updateUserToken(refreshToken, loginRequest.getUserName());

        ResponseCookie resCookies = ResponseCookie
                .from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();


        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(response);
    }

    @GetMapping("/account")
    @ApiMessage("Get account information")
    public ResponseEntity<LoginResponse.UserGetAccount> getAccount() {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get() : "";

        User currentUser = this.userService.fetchUserByEmail(email);

       UserLoginResponse userLogin = new UserLoginResponse();

        if (currentUser != null) {
            userLogin = UserLoginResponse.builder()
                    .id(currentUser.getId())
                    .email(currentUser.getEmail())
                    .name(currentUser.getName())
                    .role(currentUser.getRole())
                    .build();
        }

        LoginResponse.UserGetAccount userGetAccount = new LoginResponse.UserGetAccount();
        userGetAccount.setUser(userLogin);

        return ResponseEntity.ok().body(userGetAccount);
    }

    @GetMapping("/refresh")
    @ApiMessage("Get refresh token by user")
    public ResponseEntity<LoginResponse> getRefreshToken(@CookieValue("refresh_token") String refreshToken) throws IdInvalidException {

        // Check valid refresh token
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refreshToken);

        String email = decodedToken.getSubject();

        // Check user by token + email
        User currentUser = this.userService.fetchUserByTokenAndEmail(refreshToken, email);

        if (currentUser == null) {
            throw new IdInvalidException("Refresh token invalid");
        }

        // Issue new token/ set refresh token as cookies
        UserLoginResponse user = new UserLoginResponse();

            user = UserLoginResponse.builder()
                    .id(currentUser.getId())
                    .email(currentUser.getEmail())
                    .name(currentUser.getName())
                    .role(currentUser.getRole())
                    .build();

            LoginResponse response = new LoginResponse();
            response.setUser(user);

        // set user information log into context (will maybe use)
        String accessToken = this.securityUtil.createAccessToken(email, response);
        String newRefreshToken = this.securityUtil.createRefreshToken(email, response);

        response.setAccessToken(accessToken);

        // Update refresh token into database
        this.userService.updateUserToken(newRefreshToken, email);

        ResponseCookie resCookies = ResponseCookie
                .from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();


        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(response);
}

    @PostMapping("/logout")
    @ApiMessage("Logout user")
    private ResponseEntity<Void> logout () {

        String email = SecurityUtil.getCurrentUserLogin().get();

        User currentUser = this.userService.fetchUserByEmail(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(null);
            this.userService.updateUserToken(null, email);
        }

        ResponseCookie deleteCookies = ResponseCookie.from("refresh_token", null)
                .secure(secureCookie)
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookies.toString())
                .body(null);
    }

    @PostMapping("/register")
    @ApiMessage("Register a new user")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody UserRequest userRequest
    ) throws IdInvalidException {
        boolean isEmailExist = this.userService.existsByEmail(userRequest.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException("Email " + userRequest.getEmail() +
                    "đã tồn tại, vui lòng sử dụng email khác.");}

        UserResponse newUser = this.userService.createUser(userRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(newUser);
    }

    @PostMapping("/change-password")
    @ApiMessage("Thay đổi mật khẩu thành công")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new IdInvalidException("Người dùng chưa được xác thực");
        }
        this.userService.changePassword(email, request);
        return ResponseEntity.ok().build();
    }

}
