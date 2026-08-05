"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { saveSession, clearSession, getToken, getStoredUser } from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { name, email } | null
  const [loading, setLoading] = useState(true);   // hydrating from localStorage

  // On mount: read cached user, then silently verify token with /auth/me/
  useEffect(() => {
    const cached = getStoredUser();
    if (cached) setUser(cached);

    const token = getToken();
    if (!token) { setLoading(false); return; }

    fetch(`${API_URL}/auth/me/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setUser(data);
        saveSession(token, data); // refresh cached user
      })
      .catch(() => {
        // Token expired or invalid — clear silently
        clearSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, userData) => {
    saveSession(token, userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}