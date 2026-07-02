package thanhanh.job_recruitment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.Notification;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.repository.NotificationRepository;
import thanhanh.job_recruitment.service.UserService;
import thanhanh.job_recruitment.util.SecurityUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationController(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        Optional<String> currentUserLogin = SecurityUtil.getCurrentUserLogin();
        if (currentUserLogin.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        User user = this.userService.fetchUserByEmail(currentUserLogin.get());
        if (user == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Notification> notifications = this.notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable("id") long id) {
        Optional<String> currentUserLogin = SecurityUtil.getCurrentUserLogin();
        if (currentUserLogin.isPresent()) {
            User user = this.userService.fetchUserByEmail(currentUserLogin.get());
            if (user != null) {
                Optional<Notification> notifOpt = this.notificationRepository.findById(id);
                if (notifOpt.isPresent() && notifOpt.get().getUser() != null && notifOpt.get().getUser().getId() == user.getId()) {
                    this.notificationRepository.deleteById(id);
                }
            }
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllNotifications() {
        Optional<String> currentUserLogin = SecurityUtil.getCurrentUserLogin();
        if (currentUserLogin.isPresent()) {
            User user = this.userService.fetchUserByEmail(currentUserLogin.get());
            if (user != null) {
                List<Notification> notifications = this.notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
                this.notificationRepository.deleteAll(notifications);
            }
        }
        return ResponseEntity.noContent().build();
    }
}
