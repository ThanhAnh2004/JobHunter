package thanhanh.job_recruitment.service.impl;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.domain.Skill;
import thanhanh.job_recruitment.domain.Subscriber;
import thanhanh.job_recruitment.dto.response.Email.EmailJobResponse;
import thanhanh.job_recruitment.repository.JobRepository;
import thanhanh.job_recruitment.repository.SkillRepository;
import thanhanh.job_recruitment.repository.SubscriberRepository;
import thanhanh.job_recruitment.service.EmailService;
import thanhanh.job_recruitment.service.SubscriberService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubscriberServiceImpl implements SubscriberService {

    SubscriberRepository subscriberRepository;
    SkillRepository skillRepository;
    JobRepository jobRepository;
    EmailService emailService;

    @Override
    public boolean isExistsByEmail(String email) {
        return this.subscriberRepository.existsByEmail(email);
    }

    @Override
    public Subscriber createSubscriber(Subscriber subscriber) {
        Subscriber newSubscriber = new Subscriber();

        // Check skill
        if (subscriber.getSkills() != null) {
            List<Long> listSkillId = subscriber.getSkills().stream().map(x -> x.getId()).toList();
            List<Skill> listSkills = this.skillRepository.findByIdIn(listSkillId);
            newSubscriber.setSkills(listSkills);
        }

        newSubscriber.setEmail(subscriber.getEmail());
        newSubscriber.setName(subscriber.getName());

        this.subscriberRepository.save(newSubscriber);

        return newSubscriber;
    }

    @Override
    public Subscriber updateSubscriber(Subscriber subsDB, Subscriber subsRequest) {
        // check skills
        if (subsRequest.getSkills() != null) {
            List<Long> reqSkills = subsRequest
                    .getSkills()
                    .stream()
                    .map(x -> x.getId())
                    .toList();

            List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
            subsDB.setSkills(dbSkills);
        }
        return this.subscriberRepository.save(subsDB);
    }

    @Override
    public Subscriber findById(long id) {
        Optional<Subscriber> subscriberOptional =
                this.subscriberRepository.findById(id);
        if (subscriberOptional.isPresent()) {
            return subscriberOptional.get();
        }
        return null;
    }

    @Override
    public Subscriber findByEmail(String email) {
        Optional<Subscriber> subscriberOptional = this.subscriberRepository.findByEmail(email);

        if (subscriberOptional.isPresent()) {
            return subscriberOptional.get();
        }
        return null;
    }

    @Override
    public void sendSubscribersEmailJobs() {
        List<Subscriber> listSubs = this.subscriberRepository.findAll();
        if (listSubs != null && listSubs.size() > 0) {
            for (Subscriber sub : listSubs) {
                List<Skill> listSkills = sub.getSkills();
                if (listSkills != null && listSkills.size() > 0) {
                    List<Job> listJobs = this.jobRepository.findBySkillsIn(listSkills);
                    if (listJobs != null && listJobs.size() > 0) {
                        List<EmailJobResponse> arr = listJobs
                                .stream()
                                .map(job -> this.convertJobToSendEmail(job))
                                .toList();

                        this.emailService.sendEmailFromTemplateSync(
                                sub.getEmail(),
                                "Cơ hội việc làm hot đang chờ đón bạn, khám phá ngay",
                                "job",
                                sub.getName(),
                                arr
                        );

                    }
                }
            }
        }
    }

    private EmailJobResponse convertJobToSendEmail(Job job) {
        EmailJobResponse res = new EmailJobResponse();
        res.setName(job.getName());
        res.setSalary(job.getSalary());
        res.setCompany(new EmailJobResponse.CompanyEmail(job.getCompany().getName()));
        List<Skill> skills = job.getSkills();
        List<EmailJobResponse.SkillEmail> skillEmail = skills
                .stream()
                .map(skill -> new EmailJobResponse.SkillEmail(skill.getName()))
                .toList();
        res.setSkills(skillEmail);
        return res;
    }

}
