import { IBackendRes, ICompany, IAccount, IUser, IModelPaginate, IGetAccount, IJob, IResume, IPermission, IRole, ISkill, IDashboardStats, IConversation, IChatMessage, IChatBadge } from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
}

export const callLogin = (username: string, password: string) => {
    // Backend DTO expects field name `userName` (see LoginRequest.java)
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { userName: username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

export const callChangePassword = (oldPassword: string, newPassword: string) => {
    return axios.post<IBackendRes<void>>('/api/v1/auth/change-password', { oldPassword, newPassword })
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}




/**
 * 
Module Company
 */
export const callCreateCompany = (name: string, address: string, description: string, logo: string) => {
    return axios.post<IBackendRes<ICompany>>('/api/v1/companies', { name, address, description, logo })
}

export const callUpdateCompany = (id: string, name: string, address: string, description: string, logo: string) => {
    return axios.put<IBackendRes<ICompany>>(`/api/v1/companies`, { id, name, address, description, logo })
}

export const callDeleteCompany = (id: string) => {
    return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

export const callFetchCompany = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICompany>>>(`/api/v1/companies?${query}`);
}

export const callFetchCompanyById = (id: string) => {
    return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
}

/**
 * 
Module Skill
 */
export const callCreateSkill = (name: string) => {
    return axios.post<IBackendRes<ISkill>>('/api/v1/skills', { name })
}

export const callUpdateSkill = (id: string, name: string) => {
    return axios.put<IBackendRes<ISkill>>(`/api/v1/skills`, { id, name })
}

export const callDeleteSkill = (id: string) => {
    return axios.delete<IBackendRes<ISkill>>(`/api/v1/skills/${id}`);
}

export const callFetchAllSkill = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISkill>>>(`/api/v1/skills?${query}`);
}



/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (user: IUser) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

export const callFetchUserById = (id: string) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

/**
 * 
Module Job
 */
export const callCreateJob = (job: IJob) => {
    return axios.post<IBackendRes<IJob>>('/api/v1/jobs', { ...job })
}

export const callUpdateJob = (job: IJob, id: string) => {
    return axios.put<IBackendRes<IJob>>(`/api/v1/jobs`, { id, ...job })
}

export const callDeleteJob = (id: string) => {
    return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

export const callFetchJob = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
}

export const callFetchJobById = (id: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

/**
 * 
Module Resume
 */
export const callCreateResume = (url: string, jobId: any, email: string, userId: string | number) => {
    return axios.post<IBackendRes<IResume>>('/api/v1/resumes', {
        email, url,
        status: "PENDING",
        userId,
        jobId
    })
}

export const callUpdateResumeStatus = (id: any, status: string) => {
    return axios.put<IBackendRes<IResume>>(`/api/v1/resumes`, { id, status })
}

export const callDeleteResume = (id: string) => {
    return axios.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResume = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes?${query}`);
}

export const callFetchResumeById = (id: string) => {
    return axios.get<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResumeByUser = () => {
    return axios.post<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes/by-user`);
}

export const callGetAIMatchResume = (id: string | number) => {
    return axios.get<IBackendRes<any>>(`/api/v1/resumes/${id}/ai-match`);
}

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { id, ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { id, ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchDashboardStats = () => {
    return axios.get<IBackendRes<IDashboardStats>>('/api/v1/dashboard');
}

/**
 * Module Subscriber
 */
export const callFetchSubscriberSkills = () => {
    return axios.post<IBackendRes<any>>('/api/v1/subscribers/skills');
}

export const callCreateSubscriber = (name: string, email: string, skills: any[]) => {
    return axios.post<IBackendRes<any>>('/api/v1/subscribers', { name, email, skills });
}

export const callUpdateSubscriber = (id: number, skills: any[]) => {
    return axios.put<IBackendRes<any>>('/api/v1/subscribers', { id, skills });
}

/**
 * Module Notification
 */
export const callFetchNotifications = () => {
    return axios.get<IBackendRes<any[]>>('/api/v1/notifications');
}

export const callDeleteNotification = (id: number) => {
    return axios.delete<IBackendRes<any>>(`/api/v1/notifications/${id}`);
}

export const callClearAllNotifications = () => {
    return axios.delete<IBackendRes<any>>('/api/v1/notifications');
}

/**
 * Module Interview
 */
export const callCreateInterview = (interview: any) => {
    return axios.post<IBackendRes<any>>('/api/v1/interviews', { ...interview })
}

export const callUpdateInterview = (interview: any) => {
    return axios.put<IBackendRes<any>>(`/api/v1/interviews`, { ...interview })
}

export const callDeleteInterview = (id: string) => {
    return axios.delete<IBackendRes<any>>(`/api/v1/interviews/${id}`);
}

export const callFetchInterview = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<any>>>(`/api/v1/interviews?${query}`);
}

export const callFetchInterviewById = (id: string) => {
    return axios.get<IBackendRes<any>>(`/api/v1/interviews/${id}`);
}

export const callCandidateRespondInterview = (data: { id: number; status?: string; candidateNote?: string }) => {
    return axios.patch<IBackendRes<any>>('/api/v1/interviews/candidate-respond', data);
}

/**
 * Module Chat
 */
export const callFetchConversations = () => {
    return axios.get<IBackendRes<IConversation[]>>('/api/v1/chat/conversations');
}

export const callCreateOrGetConversation = (data: { companyId?: number; candidateId?: number; jobId?: number; initialMessage?: string }) => {
    return axios.post<IBackendRes<IConversation>>('/api/v1/chat/conversations', data);
}

export const callFetchConversationById = (id: number) => {
    return axios.get<IBackendRes<IConversation>>(`/api/v1/chat/conversations/${id}`);
}

export const callFetchMessages = (conversationId: number) => {
    return axios.get<IBackendRes<IChatMessage[]>>(`/api/v1/chat/conversations/${conversationId}/messages`);
}

export const callSendMessage = (data: { conversationId: number; content: string; type?: string }) => {
    return axios.post<IBackendRes<IChatMessage>>('/api/v1/chat/messages', data);
}

export const callMarkConversationAsRead = (conversationId: number) => {
    return axios.patch<IBackendRes<void>>(`/api/v1/chat/conversations/${conversationId}/read`);
}

export const callFetchChatBadge = () => {
    return axios.get<IBackendRes<IChatBadge>>('/api/v1/chat/badge');
}

/**
 * Module Site Settings (Footer & Static Page Contents)
 */
export const callFetchAllSettings = () => {
    return axios.get<IBackendRes<Record<string, string>>>('/api/v1/settings');
}

export const callFetchSettingByKey = (key: string) => {
    return axios.get<IBackendRes<any>>(`/api/v1/settings/${key}`);
}

export const callUpdateSetting = (key: string, value: string, description?: string) => {
    return axios.put<IBackendRes<any>>(`/api/v1/settings/${key}`, { value, description });
}

export const callBatchUpdateSettings = (settings: Record<string, string>) => {
    return axios.post<IBackendRes<Record<string, string>>>('/api/v1/settings', settings);
}
