import React, { useState } from 'react';
import { IConversation } from '@/types/backend';
import { Input, Avatar, Badge, Empty } from 'antd';
import { SearchOutlined, UserOutlined, BankOutlined } from '@ant-design/icons';
import { withBackendUrl, DEFAULT_COMPANY_LOGO, getCompanyLogoUrl } from '@/config/runtime';
import { formatRelativeTime } from '@/config/utils';

interface IProps {
    conversations: IConversation[];
    activeConversationId: number | null;
    onSelectConversation: (conv: IConversation) => void;
    isHrView?: boolean;
}

const ConversationList: React.FC<IProps> = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    isHrView = false,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = conversations.filter((conv) => {
        const targetName = isHrView ? conv.candidateName : conv.companyName;
        const jobTitle = conv.jobName || '';
        const term = searchTerm.toLowerCase();
        return targetName.toLowerCase().includes(term) || jobTitle.toLowerCase().includes(term);
    });

    return (
        <div className="chat-sidebar">
            <div className="chat-sidebar-header">
                <div className="sidebar-title">
                    <span>Hội thoại ({conversations.length})</span>
                </div>
                <Input
                    placeholder="Tìm kiếm theo tên, công việc..."
                    prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    style={{ borderRadius: 8 }}
                />
            </div>

            <div className="chat-conversation-list">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map((conv) => {
                        const isActive = conv.id === activeConversationId;
                        const partnerName = isHrView ? conv.candidateName : conv.companyName;
                        const candidateAvatar = conv.candidateAvatar;
                        const companyLogo = conv.companyLogo;

                        return (
                            <div
                                key={conv.id}
                                className={`conversation-item ${isActive ? 'active' : ''}`}
                                onClick={() => onSelectConversation(conv)}
                            >
                                <div className="conv-avatar-box">
                                    {isHrView ? (
                                        candidateAvatar ? (
                                            <Avatar
                                                src={withBackendUrl(`/storage/avatar/${candidateAvatar}`)}
                                                size={44}
                                                onError={() => false}
                                                style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
                                            >
                                                {partnerName ? partnerName.substring(0, 2).toUpperCase() : 'U'}
                                            </Avatar>
                                        ) : (
                                            <Avatar
                                                size={44}
                                                style={{ backgroundColor: '#3b82f6', fontWeight: 600, fontSize: 16 }}
                                            >
                                                {partnerName ? partnerName.substring(0, 2).toUpperCase() : <UserOutlined />}
                                            </Avatar>
                                        )
                                    ) : (
                                        <Avatar
                                            src={getCompanyLogoUrl(companyLogo)}
                                            size={44}
                                            shape="square"
                                            onError={() => false}
                                            style={{ borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0' }}
                                        >
                                            {partnerName ? partnerName.substring(0, 2).toUpperCase() : <BankOutlined />}
                                        </Avatar>
                                    )}
                                </div>

                                <div className="conv-info">
                                    <div className="conv-header">
                                        <span className="conv-name">{partnerName || 'Chưa cập nhật'}</span>
                                        <span className="conv-time">
                                            {conv.lastMessageAt ? formatRelativeTime(conv.lastMessageAt) : ''}
                                        </span>
                                    </div>

                                    <div className="conv-preview">
                                        <span className="last-message">
                                            {conv.lastMessage || 'Bắt đầu cuộc hội thoại...'}
                                        </span>
                                        {conv.unreadCount > 0 && (
                                            <span className="unread-badge">{conv.unreadCount}</span>
                                        )}
                                    </div>

                                    {conv.jobName && (
                                        <span className="conv-job-tag" title={conv.jobName}>
                                            💼 {conv.jobName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span style={{ color: '#64748b', fontSize: 13 }}>
                                    {searchTerm ? 'Không tìm thấy cuộc hội thoại phù hợp' : 'Chưa có cuộc hội thoại nào'}
                                </span>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationList;
