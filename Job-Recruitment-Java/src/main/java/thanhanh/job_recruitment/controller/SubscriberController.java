package thanhanh.job_recruitment.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.domain.Subscriber;
import thanhanh.job_recruitment.service.SubscriberService;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;

@RestController
@RequestMapping("/api/v1/subscribers")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubscriberController {

    SubscriberService subscriberService;

    @PostMapping
    @ApiMessage("Create a subscriber")
    public ResponseEntity<Subscriber> create(@Valid @RequestBody Subscriber sub)
            throws IdInvalidException {
        // check email
        boolean isExist = this.subscriberService.isExistsByEmail(sub.getEmail());
        if (isExist) {
            throw new IdInvalidException("Email " + sub.getEmail() + " has existed");
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.subscriberService.createSubscriber(sub));
    }

    @PutMapping
    @ApiMessage("Update a subscriber")
    public ResponseEntity<Subscriber> update(@RequestBody Subscriber subscriber)
            throws IdInvalidException {
        // check id
        Subscriber subsDB = this.subscriberService.findById(subscriber.getId());
        if (subsDB == null) {
            throw new IdInvalidException("Id " + subscriber.getId() + " not existed");
        }
        return ResponseEntity
                .ok()
                .body(this.subscriberService.updateSubscriber(subsDB, subscriber));
    }

    @PostMapping("/skills")
    @ApiMessage("Get subscrber skill")
    public ResponseEntity<Subscriber> getSubscriberSkill() {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get() : null;

        return ResponseEntity.ok().body(this.subscriberService.findByEmail(email));
    }
}
