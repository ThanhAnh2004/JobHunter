package thanhanh.job_recruitment.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import thanhanh.job_recruitment.repository.JobRepository;


import java.nio.charset.StandardCharsets;

@Service
@AllArgsConstructor
public class EmailService {

    private final MailSender mailSender;
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;
    private final JobRepository jobRepository;



    public String sendSimpleEmail() {
        SimpleMailMessage msg = new SimpleMailMessage();

        msg.setTo("thanhanhdz2004@gmail.com");
        msg.setSubject("Testing send email");
        msg.setText("Hello world");

        this.mailSender.send(msg);

        return "Oke tesst";
    }

    public void sendEmailSync(
            String to,
            String subject,
            String content,
            boolean isMultipart,
            boolean isHtml
    ) {
        // Prepare message using a Spring helper
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(
                    mimeMessage,
                    isMultipart,
                    StandardCharsets.UTF_8.name()
            );
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content, isHtml);
            this.javaMailSender.send(mimeMessage);
        } catch (MailException | MessagingException e) {
            System.out.println("ERROR SEND EMAIL: " + e);
        }
    }

        @Async
        public void sendEmailFromTemplateSync(
                String to,
                String subject,
                String templateName,
                String username,
                Object value
  ) {
            Context context = new Context();
            context.setVariable("name", username);
            context.setVariable("jobs", value);

            String content = templateEngine.process(templateName, context);
            this.sendEmailSync(to, subject, content, false, true);
        }

}
