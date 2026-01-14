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

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    return handleAuthResponse<AuthResponse>(response);
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

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    return handleAuthResponse<void>(response);
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

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
    });
    return handleAuthResponse<User>(response);
}

// Password Management
export async function forgotPassword(
    data: ForgotPasswordRequest,
): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleAuthResponse(response);
}

export async function resetPassword(
    data: ResetPasswordRequest,
): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleAuthResponse(response);
}

export async function changePassword(
    data: ChangePasswordRequest,
): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    return handleAuthResponse(response);
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
