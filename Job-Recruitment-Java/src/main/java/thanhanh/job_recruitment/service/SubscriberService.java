package thanhanh.job_recruitment.service;

import thanhanh.job_recruitment.domain.Subscriber;

public interface SubscriberService {
    boolean isExistsByEmail(String email);
    Subscriber createSubscriber(Subscriber subscriber);
    Subscriber updateSubscriber(Subscriber subsDB, Subscriber subsRequest);
    Subscriber findById(long id);
    Subscriber findByEmail(String email);
    void sendSubscribersEmailJobs();
}
