package thanhanh.job_recruitment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thanhanh.job_recruitment.dto.request.Chat.CreateConversationRequest;
import thanhanh.job_recruitment.dto.request.Chat.SendMessageRequest;
import thanhanh.job_recruitment.dto.response.Chat.ChatBadgeResponse;
import thanhanh.job_recruitment.dto.response.Chat.ChatMessageResponse;
import thanhanh.job_recruitment.dto.response.Chat.ConversationResponse;
import thanhanh.job_recruitment.service.ChatService;
import thanhanh.job_recruitment.util.annotation.ApiMessage;
import thanhanh.job_recruitment.util.exception.IdInvalidException;
import thanhanh.job_recruitment.util.exception.PermissionException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    @ApiMessage("Lấy danh sách các cuộc hội thoại")
    public ResponseEntity<List<ConversationResponse>> getConversations() throws PermissionException {
        return ResponseEntity.ok(this.chatService.getConversationsForCurrentUser());
    }

    @PostMapping("/conversations")
    @ApiMessage("Khởi tạo hoặc tìm kiếm cuộc hội thoại")
    public ResponseEntity<ConversationResponse> getOrCreateConversation(@Valid @RequestBody CreateConversationRequest request)
            throws IdInvalidException, PermissionException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.chatService.getOrCreateConversation(request));
    }

    @GetMapping("/conversations/{id}")
    @ApiMessage("Lấy thông tin chi tiết cuộc hội thoại")
    public ResponseEntity<ConversationResponse> getConversationById(@PathVariable("id") Long id)
            throws IdInvalidException, PermissionException {
        return ResponseEntity.ok(this.chatService.getConversationById(id));
    }

    @GetMapping("/conversations/{id}/messages")
    @ApiMessage("Lấy danh sách tin nhắn trong cuộc hội thoại")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(@PathVariable("id") Long id)
            throws IdInvalidException, PermissionException {
        return ResponseEntity.ok(this.chatService.getMessages(id));
    }

    @PostMapping("/messages")
    @ApiMessage("Gửi tin nhắn mới")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody SendMessageRequest request)
            throws IdInvalidException, PermissionException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.chatService.sendMessage(request));
    }

    @PatchMapping("/conversations/{id}/read")
    @ApiMessage("Đánh dấu cuộc hội thoại là đã đọc")
    public ResponseEntity<Void> markAsRead(@PathVariable("id") Long id)
            throws IdInvalidException, PermissionException {
        this.chatService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/badge")
    @ApiMessage("Lấy số lượng cuộc hội thoại chưa đọc")
    public ResponseEntity<ChatBadgeResponse> getUnreadBadge() throws PermissionException {
        return ResponseEntity.ok(this.chatService.getUnreadBadge());
    }
}
