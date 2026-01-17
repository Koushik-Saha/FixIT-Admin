import { createClient } from "./supabase/client";
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    SessionsResponse,
    User,
} from "./types/auth";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Enable mock mode for development (set to false when backend is ready)
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

async function handleAuthResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error: ApiError = {
            message: "An error occurred",
            status: response.status,
        };

        try {
            const errorData = await response.json();
            error.message = errorData.message || error.message;
            error.errors = errorData.errors;
        } catch {
            error.message = `HTTP ${response.status}: ${response.statusText}`;
        }

        throw error;
    }

    return response.json();
}

// Mock user storage (for development only)
const mockUser: User = {
    id: "mock-user-1",
    email: "admin@fixit.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
};

// Authentication
export async function login(data: LoginRequest): Promise<AuthResponse> {
    if (MOCK_MODE) {
        // Mock login - simulate delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Store in localStorage for mock persistence
        localStorage.setItem("mock_auth_user", JSON.stringify(mockUser));

        return {
            user: mockUser,
            message: "Login successful (MOCK MODE)",
        };
    }

    // Use Supabase for authentication
    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    if (error) {
        throw {
            message: error.message,
            status: 401,
        };
    }

    if (!authData.user) {
        throw {
            message: "Login failed",
            status: 401,
        };
    }

    // Fetch user profile from the frontend API
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
    });

    const userData = await handleAuthResponse<User>(response);

    return {
        user: userData,
        message: "Login successful",
    };
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    if (MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newUser: User = {
            id: "mock-user-" + Date.now(),
            email: data.email,
            name: data.name,
            role: "admin",
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
        };

        localStorage.setItem("mock_auth_user", JSON.stringify(newUser));

        return {
            user: newUser,
            message: "Registration successful (MOCK MODE)",
        };
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    return handleAuthResponse<AuthResponse>(response);
}

export async function logout(): Promise<void> {
    if (MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        localStorage.removeItem("mock_auth_user");
        return;
    }

    // Sign out from Supabase
    const supabase = createClient();
    await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User> {
    if (MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const storedUser = localStorage.getItem("mock_auth_user");
        if (!storedUser) {
            throw new Error("Not authenticated");
        }
        return JSON.parse(storedUser);
    }

    // Check Supabase session first
    const supabase = createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (!supabaseUser) {
        throw new Error("Not authenticated");
    }

    // Fetch user profile from the frontend API
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
    });

    return handleAuthResponse<User>(response);
}

// Password Management
export async function forgotPassword(
    data: ForgotPasswordRequest,
): Promise<{ message: string }> {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
        throw {
            message: error.message,
            status: 400,
        };
    }

    return {
        message: "Password reset email sent successfully",
    };
}

export async function resetPassword(
    data: ResetPasswordRequest,
): Promise<{ message: string }> {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
        password: data.password,
    });

    if (error) {
        throw {
            message: error.message,
            status: 400,
        };
    }

    return {
        message: "Password reset successfully",
    };
}

export async function changePassword(
    data: ChangePasswordRequest,
): Promise<{ message: string }> {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
    });

    if (error) {
        throw {
            message: error.message,
            status: 400,
        };
    }

    return {
        message: "Password changed successfully",
    };
}

// Session Management
export async function getSessions(): Promise<SessionsResponse> {
    if (MOCK_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
            sessions: [
                {
                    id: "session-1",
                    deviceInfo: "Desktop",
                    browser: "Chrome 120",
                    ipAddress: "127.0.0.1",
                    location: "Local Development",
                    lastActive: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    isCurrent: true,
                },
            ],
        };
    }

    const response = await fetch(`${API_BASE_URL}/auth/sessions`, {
        credentials: "include",
    });
    return handleAuthResponse(response);
}

export async function revokeSession(
    sessionId: string,
): Promise<{ message: string }> {
    const response = await fetch(
        `${API_BASE_URL}/auth/sessions/${sessionId}`,
        {
            method: "DELETE",
            credentials: "include",
        },
    );
    return handleAuthResponse(response);
}

export async function revokeAllOtherSessions(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/sessions/all`, {
        method: "DELETE",
        credentials: "include",
    });
    return handleAuthResponse(response);
}
