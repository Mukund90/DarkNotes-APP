import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = sessionStorage.getItem('darknotes_session');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (session) {
      sessionStorage.setItem('darknotes_session', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('darknotes_session');
    }
  }, [session]);

  const value = {
    session,
    token: session?.access_token || null,
    user: session?.user || null,
    isAuthenticated: !!session,
    setSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
