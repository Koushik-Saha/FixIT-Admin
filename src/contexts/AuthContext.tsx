"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, logout as apiLogout } from "@/lib/auth";
import { setUnauthorizedCallback } from "@/lib/api";
import type { User } from "@/lib/types/auth";
import { Spin } from "antd";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const handleUnauthorized = useCallback(() => {
        setUser(null);
        if (!PUBLIC_ROUTES.includes(pathname)) {
            router.push("/auth/login");
        }
    }, [pathname, router]);

    // Set up unauthorized callback for API client
    useEffect(() => {
        setUnauthorizedCallback(handleUnauthorized);
    }, [handleUnauthorized]);

    const checkAuth = useCallback(async () => {
        // ⚠️ AUTHENTICATION DISABLED - Uncomment to re-enable
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
            // // Only redirect if not on public route
            // if (
            //     !PUBLIC_ROUTES.includes(pathname) &&
            //     !pathname.startsWith("/auth/")
            // ) {
            //     router.push("/auth/login");
            // }
        } finally {
            setLoading(false);
        }
    }, [pathname, router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback(
        (userData: User) => {
            setUser(userData);
            router.push("/");
        },
        [router],
    );

    const logout = useCallback(async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            router.push("/auth/login");
        }
    }, [router]);

    const refreshUser = useCallback(async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        }
    }, []);

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    background: "#020617",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    // ⚠️ AUTHENTICATION DISABLED - Redirect to login if not authenticated
    // if (
    //     !user &&
    //     !PUBLIC_ROUTES.includes(pathname) &&
    //     !pathname.startsWith("/auth/")
    // ) {
    //     if (typeof window !== "undefined") {
    //         router.push("/auth/login");
    //     }
    //     return null;
    // }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
