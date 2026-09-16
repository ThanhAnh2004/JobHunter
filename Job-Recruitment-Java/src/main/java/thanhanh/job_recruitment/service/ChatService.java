package thanhanh.job_recruitment.service;

import thanhanh.job_recruitment.dto.request.Chat.CreateConversationRequest;
import thanhanh.job_recruitment.dto.request.Chat.SendMessageRequest;
import thanhanh.job_recruitment.dto.response.Chat.ChatBadgeResponse;
import thanhanh.job_recruitment.dto.response.Chat.ChatMessageResponse;
import thanhanh.job_recruitment.dto.response.Chat.ConversationResponse;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.util.exception.PermissionException;

import java.util.List;

public interface ChatService {

    List<ConversationResponse> getConversationsForCurrentUser() throws PermissionException;

    ConversationResponse getOrCreateConversation(CreateConversationRequest request) throws IdInvalidException, PermissionException;

    ConversationResponse getConversationById(Long conversationId) throws IdInvalidException, PermissionException;

    List<ChatMessageResponse> getMessages(Long conversationId) throws IdInvalidException, PermissionException;

    ChatMessageResponse sendMessage(SendMessageRequest request) throws IdInvalidException, PermissionException;

    void markAsRead(Long conversationId) throws IdInvalidException, PermissionException;

    ChatBadgeResponse getUnreadBadge() throws PermissionException;
}
