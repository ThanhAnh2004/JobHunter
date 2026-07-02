package thanhanh.job_recruitment.dto.request.Interview;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import thanhanh.job_recruitment.util.constant.InterviewStateEnum;

/**
 * Request DTO dành riêng cho ứng viên: đồng ý, từ chối, hoặc gửi ghi chú/đề xuất
 */
@Getter
@Setter
public class CandidateRespondInterviewRequest {
    @NotNull(message = "ID lịch phỏng vấn là bắt buộc")
    private Long id;

    /**
     * ACCEPTED hoặc REJECTED
     */
    private InterviewStateEnum status;

    /**
     * Ghi chú, đề xuất từ ứng viên (ví dụ: đề xuất đổi giờ)
     */
    private String candidateNote;
}
