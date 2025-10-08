import { createContext, useRef, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT;

interface User {
  user_id: string;
  user_name: string;
  email: string;
  role: "admin" | "user";
  exp: number;
}
interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  scheduleAutoLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      try {
        const decoded = jwtDecode<User & { exp: number }>(savedToken);
        setUser(decoded);
        localStorage.setItem("exp", String(decoded.exp));
        scheduleAutoLogout();
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []); 


  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_ENDPOINT}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: username, password }),
      });

      if (!response.ok) return false;
      const data = await response.json()
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode<User & { exp: number }>(data.token);
        setUser(decoded);
        localStorage.setItem("exp", String(decoded.exp));
        scheduleAutoLogout();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("exp");
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleAutoLogout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const now = Date.now();
    const exp = localStorage.getItem("exp");
    if (!exp) return;
    const timeLeft = parseInt(exp) * 1000 - now;
    if (timeLeft <= 0) {
      logout();
    } else {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, timeLeft);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, scheduleAutoLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

