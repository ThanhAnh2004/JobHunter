package thanhanh.job_recruitment.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import thanhanh.job_recruitment.domain.ChatMessage;
import thanhanh.job_recruitment.domain.Company;
import thanhanh.job_recruitment.domain.Conversation;
import thanhanh.job_recruitment.domain.Job;
import thanhanh.job_recruitment.domain.User;
import thanhanh.job_recruitment.dto.request.Chat.CreateConversationRequest;
import thanhanh.job_recruitment.dto.request.Chat.SendMessageRequest;
import thanhanh.job_recruitment.dto.response.Chat.ChatBadgeResponse;
import thanhanh.job_recruitment.dto.response.Chat.ChatMessageResponse;
import thanhanh.job_recruitment.dto.response.Chat.ConversationResponse;
import thanhanh.job_recruitment.repository.ChatMessageRepository;
import thanhanh.job_recruitment.repository.CompanyRepository;
import thanhanh.job_recruitment.repository.ConversationRepository;
import thanhanh.job_recruitment.repository.JobRepository;
import thanhanh.job_recruitment.repository.UserRepository;
import thanhanh.job_recruitment.service.ChatService;
import thanhanh.job_recruitment.util.SecurityUtil;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.util.exception.PermissionException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private User getCurrentUser() throws PermissionException {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new PermissionException("Bạn cần đăng nhập để sử dụng tính năng này.");
        }
        return this.userRepository.findByEmail(email)
                .orElseThrow(() -> new PermissionException("Không tìm thấy thông tin tài khoản hiện tại."));
    }

    private boolean isSuperAdmin(User user) {
        if (user == null) return false;
        if ("admin@gmail.com".equalsIgnoreCase(user.getEmail())) return true;
        return user.getRole() != null && "SUPER_ADMIN".equalsIgnoreCase(user.getRole().getName());
    }

    private boolean isHrUser(User user) {
        if (user == null || user.getRole() == null) return false;
        String roleName = user.getRole().getName();
        return "HR".equalsIgnoreCase(roleName) || "ROLE_HR".equalsIgnoreCase(roleName) || "RECRUITER".equalsIgnoreCase(roleName);
    }

    private void checkConversationAccess(Conversation conversation, User currentUser) throws PermissionException {
        if (isSuperAdmin(currentUser)) return;

        boolean isCandidate = conversation.getCandidate() != null && conversation.getCandidate().getId() == currentUser.getId();
        boolean isCompanyHr = isHrUser(currentUser) && currentUser.getCompany() != null
                && conversation.getCompany() != null
                && conversation.getCompany().getId() == currentUser.getCompany().getId();

        if (!isCandidate && !isCompanyHr) {
            throw new PermissionException("Bạn không có quyền truy cập vào cuộc hội thoại này.");
        }
    }

    private ConversationResponse mapToConversationResponse(Conversation conv, User currentUser) {
        boolean isHr = isHrUser(currentUser);
        int unreadCount = isHr ? conv.getUnreadHr() : conv.getUnreadCandidate();

        return ConversationResponse.builder()
                .id(conv.getId())
                .candidateId(conv.getCandidate() != null ? conv.getCandidate().getId() : 0)
                .candidateName(conv.getCandidate() != null ? conv.getCandidate().getName() : "")
                .candidateEmail(conv.getCandidate() != null ? conv.getCandidate().getEmail() : "")
                .candidateAvatar(conv.getCandidate() != null ? conv.getCandidate().getAvatar() : null)
                .companyId(conv.getCompany() != null ? conv.getCompany().getId() : 0)
                .companyName(conv.getCompany() != null ? conv.getCompany().getName() : "")
                .companyLogo(conv.getCompany() != null ? conv.getCompany().getLogo() : null)
                .jobId(conv.getJob() != null ? conv.getJob().getId() : null)
                .jobName(conv.getJob() != null ? conv.getJob().getName() : null)
                .lastMessage(conv.getLastMessage())
                .lastMessageAt(conv.getLastMessageAt())
                .lastSenderId(conv.getLastSender() != null ? conv.getLastSender().getId() : null)
                .unreadCount(unreadCount)
                .createdAt(conv.getCreatedAt())
                .updatedAt(conv.getUpdatedAt())
                .build();
    }

    private ChatMessageResponse mapToChatMessageResponse(ChatMessage msg) {
        String senderAvatar = null;
        if (msg.getSender() != null) {
            if (msg.getSender().getAvatar() != null && !msg.getSender().getAvatar().isBlank()) {
                senderAvatar = "/storage/avatar/" + msg.getSender().getAvatar();
            } else if (msg.getSender().getCompany() != null && msg.getSender().getCompany().getLogo() != null && !msg.getSender().getCompany().getLogo().isBlank()) {
                senderAvatar = "/storage/company/" + msg.getSender().getCompany().getLogo();
            }
        }

        return ChatMessageResponse.builder()
                .id(msg.getId())
                .conversationId(msg.getConversation().getId())
                .senderId(msg.getSender() != null ? msg.getSender().getId() : 0)
                .senderName(msg.getSender() != null ? msg.getSender().getName() : "")
                .senderAvatar(senderAvatar)
                .content(msg.getContent())
                .type(msg.getType())
                .isRead(msg.isRead())
                .createdAt(msg.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> getConversationsForCurrentUser() throws PermissionException {
        User currentUser = getCurrentUser();
        List<Conversation> list;

        if (isHrUser(currentUser) && currentUser.getCompany() != null) {
            list = this.conversationRepository.findByCompanyIdOrderByLastMessageAtDesc(currentUser.getCompany().getId());
        } else {
            list = this.conversationRepository.findByCandidateIdOrderByLastMessageAtDesc(currentUser.getId());
        }

        return list.stream()
                .map(conv -> mapToConversationResponse(conv, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConversationResponse getOrCreateConversation(CreateConversationRequest request) throws IdInvalidException, PermissionException {
        User currentUser = getCurrentUser();

        Long candidateId;
        Long companyId;

        if (isHrUser(currentUser) && currentUser.getCompany() != null) {
            // HR chủ động mở chat với ứng viên
            companyId = currentUser.getCompany().getId();
            candidateId = request.getCandidateId();
            if (candidateId == null) {
                throw new IdInvalidException("Vui lòng cung cấp candidateId của ứng viên.");
            }
        } else {
            // Ứng viên chủ động mở chat với công ty
            candidateId = currentUser.getId();
            companyId = request.getCompanyId();
            if (companyId == null) {
                throw new IdInvalidException("Vui lòng cung cấp companyId của nhà tuyển dụng.");
            }
        }

        User candidate = this.userRepository.findById(candidateId)
                .orElseThrow(() -> new IdInvalidException("Không tìm thấy ứng viên với id: " + candidateId));
        Company company = this.companyRepository.findById(companyId)
                .orElseThrow(() -> new IdInvalidException("Không tìm thấy công ty với id: " + companyId));

        Job job = null;
        if (request.getJobId() != null) {
            job = this.jobRepository.findById(request.getJobId()).orElse(null);
        }

        // Kiểm tra xem đã có cuộc hội thoại giữa 2 bên chưa
        Optional<Conversation> existingOpt = this.conversationRepository.findExistingConversation(candidateId, companyId, request.getJobId());
        if (existingOpt.isEmpty()) {
            existingOpt = this.conversationRepository.findFirstByCandidateIdAndCompanyId(candidateId, companyId);
        }

        Conversation conversation;
        if (existingOpt.isPresent()) {
            conversation = existingOpt.get();
            if (job != null && conversation.getJob() == null) {
                conversation.setJob(job);
                this.conversationRepository.save(conversation);
            }
        } else {
            conversation = Conversation.builder()
                    .candidate(candidate)
                    .company(company)
                    .job(job)
                    .lastMessage(request.getInitialMessage() != null ? request.getInitialMessage() : "Bắt đầu cuộc trò chuyện")
                    .lastMessageAt(Instant.now())
                    .lastSender(currentUser)
                    .unreadCandidate(0)
                    .unreadHr(0)
                    .build();
            conversation = this.conversationRepository.save(conversation);
        }

        if (request.getInitialMessage() != null && !request.getInitialMessage().trim().isEmpty()) {
            SendMessageRequest msgReq = new SendMessageRequest();
            msgReq.setConversationId(conversation.getId());
            msgReq.setContent(request.getInitialMessage().trim());
            msgReq.setType("TEXT");
            sendMessage(msgReq);
        }

        return mapToConversationResponse(conversation, currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationResponse getConversationById(Long conversationId) throws IdInvalidException, PermissionException {
        User currentUser = getCurrentUser();
        Conversation conversation = this.conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IdInvalidException("Không tìm thấy cuộc hội thoại với id: " + conversationId));

        checkConversationAccess(conversation, currentUser);
        return mapToConversationResponse(conversation, currentUser);
    }

    @Override
    @Transactional
    public List<ChatMessageResponse> getMessages(Long conversationId) throws IdInvalidException, PermissionException {
        User currentUser = getCurrentUser();
        Conversation conversation = this.conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IdInvalidException("Không tìm thấy cuộc hội thoại với id: " + conversationId));

        checkConversationAccess(conversation, currentUser);

        // Đánh dấu các tin nhắn người khác gửi cho mình là đã đọc
        this.chatMessageRepository.markMessagesAsRead(conversationId, currentUser.getId());

        // Reset bộ đếm chưa đọc trên Conversation
        boolean isHr = isHrUser(currentUser);
        if (isHr) {
            conversation.setUnreadHr(0);
        } else {
            conversation.setUnreadCandidate(0);
        }
        this.conversationRepository.save(conversation);

        List<ChatMessage> messages = this.chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        return messages.stream()
                .map(this::mapToChatMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatMessageResponse sendMessage(SendMessageRequest request) throws IdInvalidException, PermissionException {
        User currentUser = getCurrentUser();
        Conversation conversation = this.conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new IdInvalidException("Không tìm thấy cuộc hội thoại với id: " + request.getConversationId()));

        checkConversationAccess(conversation, currentUser);

        // Lưu tin nhắn
        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(currentUser)
                .content(request.getContent().trim())
                .type(request.getType() != null ? request.getType() : "TEXT")
                .isRead(false)
                .build();
        message = this.chatMessageRepository.save(message);

        // Cập nhật cuộc hội thoại
        conversation.setLastMessage(message.getContent());
        conversation.setLastMessageAt(Instant.now());
        conversation.setLastSender(currentUser);

        boolean isHr = isHrUser(currentUser);
        if (isHr) {
            conversation.setUnreadCandidate(conversation.getUnreadCandidate() + 1);
        } else {
            conversation.setUnreadHr(conversation.getUnreadHr() + 1);
        }
        this.conversationRepository.save(conversation);

        ChatMessageResponse response = mapToChatMessageResponse(message);

        // Broadcast Real-time qua STOMP WebSocket
        try {
            // 1. Gửi tới kênh chat của cuộc hội thoại
            this.messagingTemplate.convertAndSend("/topic/conversations/" + conversation.getId(), response);

            // 2. Gửi thông báo tới người nhận để cập nhật số tin nhắn chưa đọc / danh sách hội thoại
            Long recipientUserId = isHr
                    ? conversation.getCandidate().getId()
                    : (conversation.getLastSender() != null && conversation.getLastSender().getId() != currentUser.getId()
                    ? conversation.getLastSender().getId()
                    : null);

            if (recipientUserId != null) {
                this.messagingTemplate.convertAndSend("/topic/chat/" + recipientUserId, response);
            }
            // Với HR, cũng broadcast tới topic công ty để các HR khác cùng công ty thấy tin nhắn mới
            if (!isHr && conversation.getCompany() != null) {
                this.messagingTemplate.convertAndSend("/topic/chat/company/" + conversation.getCompany().getId(), response);
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi STOMP WebSocket message: " + e.getMessage());
        }

        return response;
    }

    @Override
    @Transactional
    public void markAsRead(Long conversationId) throws IdInvalidException, PermissionException {
        User currentUser = getCurrentUser();
        Conversation conversation = this.conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IdInvalidException("Không tìm thấy cuộc hội thoại với id: " + conversationId));

        checkConversationAccess(conversation, currentUser);

        this.chatMessageRepository.markMessagesAsRead(conversationId, currentUser.getId());

        if (isHrUser(currentUser)) {
            conversation.setUnreadHr(0);
        } else {
            conversation.setUnreadCandidate(0);
        }
        this.conversationRepository.save(conversation);
    }

    @Override
    @Transactional(readOnly = true)
    public ChatBadgeResponse getUnreadBadge() throws PermissionException {
        User currentUser = getCurrentUser();
        int unreadCount;

        if (isHrUser(currentUser) && currentUser.getCompany() != null) {
            unreadCount = this.conversationRepository.countUnreadConversationsForHr(currentUser.getCompany().getId());
        } else {
            unreadCount = this.conversationRepository.countUnreadConversationsForCandidate(currentUser.getId());
        }

        return ChatBadgeResponse.builder()
                .unreadConversations(unreadCount)
                .build();
    }
}
