package thanhanh.job_recruitment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import thanhanh.job_recruitment.domain.Conversation;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long>, JpaSpecificationExecutor<Conversation> {

    @Query("SELECT c FROM Conversation c WHERE c.candidate.id = :candidateId AND c.company.id = :companyId AND (:jobId IS NULL OR c.job.id = :jobId)")
    Optional<Conversation> findExistingConversation(
            @Param("candidateId") Long candidateId,
            @Param("companyId") Long companyId,
            @Param("jobId") Long jobId
    );

    Optional<Conversation> findFirstByCandidateIdAndCompanyId(Long candidateId, Long companyId);

    List<Conversation> findByCandidateIdOrderByLastMessageAtDesc(Long candidateId);

    List<Conversation> findByCompanyIdOrderByLastMessageAtDesc(Long companyId);

    @Query("SELECT COUNT(c) FROM Conversation c WHERE c.candidate.id = :candidateId AND c.unreadCandidate > 0")
    int countUnreadConversationsForCandidate(@Param("candidateId") Long candidateId);

    @Query("SELECT COUNT(c) FROM Conversation c WHERE c.company.id = :companyId AND c.unreadHr > 0")
    int countUnreadConversationsForHr(@Param("companyId") Long companyId);
}
