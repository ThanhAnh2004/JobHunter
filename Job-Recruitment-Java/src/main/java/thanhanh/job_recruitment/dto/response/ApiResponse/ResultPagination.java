package thanhanh.job_recruitment.dto.response.ApiResponse;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResultPagination {
    private Meta meta;
    private Object result;
}
