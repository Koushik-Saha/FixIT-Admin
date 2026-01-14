export interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "super_admin";
    createdAt: string;
    lastLoginAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    user: User;
    message?: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface Session {
    id: string;
    deviceInfo: string;
    browser: string;
    ipAddress: string;
    location?: string;
    lastActive: string;
    createdAt: string;
    isCurrent: boolean;
}

export interface SessionsResponse {
    sessions: Session[];
}

export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}
