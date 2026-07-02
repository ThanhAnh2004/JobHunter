package thanhanh.job_recruitment.dto.response.ApiResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@NoArgsConstructor
@Service
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Meta {
    int page;
    int pageSize;
    int pages;
    long total;
}
