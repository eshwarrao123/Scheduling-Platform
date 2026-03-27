"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

interface AuthUser {
    userId: string;
    email: string;
    username: string;
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Hydrate from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("schedula_token");
        const storedUser = localStorage.getItem("schedula_user");
        if (stored && storedUser) {
            setToken(stored);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = useCallback((token: string, user: AuthUser) => {
        localStorage.setItem("schedula_token", token);
        localStorage.setItem("schedula_user", JSON.stringify(user));
        setToken(token);
        setUser(user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("schedula_token");
        localStorage.removeItem("schedula_user");
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
