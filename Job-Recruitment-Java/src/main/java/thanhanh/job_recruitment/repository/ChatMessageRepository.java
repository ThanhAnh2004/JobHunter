package thanhanh.job_recruitment.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import thanhanh.job_recruitment.domain.ChatMessage;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    Page<ChatMessage> findByConversationIdOrderByCreatedAtDesc(Long conversationId, Pageable pageable);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.conversation.id = :conversationId AND m.sender.id != :currentUserId AND m.isRead = false")
    int markMessagesAsRead(@Param("conversationId") Long conversationId, @Param("currentUserId") Long currentUserId);
}
