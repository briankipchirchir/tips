import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authApi, userApi } from "../services/api";

type PlanLevel = "FREE" | "SILVER" | "GOLD" | "PLATINUM" | "VALUE_BETS" | "NONE";
type Duration = "1day" | "3days" | "1week" | "1month";

interface UserData {
  id: string;
  fullName: string;
  phone: string;
  smsNumber: string;
  role: string;
  activeSubscription?: {
    planLevel: PlanLevel;
    endDate: string;
    active: boolean;
  } | null;
}

interface AuthContextType {
  user: UserData | null;
  userPlan: PlanLevel;
  subscriptionExpiry: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (fullName: string, phone: string, password: string, smsNumber?: string) => Promise<void>;
  logout: () => void;
  subscribe: (plan: PlanLevel, duration: Duration) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const userPlan: PlanLevel = user?.activeSubscription?.active
    ? (user.activeSubscription.planLevel as PlanLevel)
    : "NONE";

  const subscriptionExpiry = user?.activeSubscription?.endDate ?? null;

  // On mount — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      userApi.getProfile()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phone: string, password: string) => {
    const res = await authApi.login({ phone, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setUser(res.data.user);
  };

  const register = async (
    fullName: string,
    phone: string,
    password: string,
    smsNumber?: string
  ) => {
    const res = await authApi.register({
      fullName,
      phone,
      smsNumber: smsNumber || phone,
      password,
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setUser(res.data.user);
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const subscribe = (_plan: PlanLevel, _duration: Duration) => {
    // Called after successful M-Pesa payment
    // Refresh profile to get updated subscription from backend
    refreshProfile();
  };

  const refreshProfile = async () => {
    try {
      const res = await userApi.getProfile();
      setUser(res.data);
    } catch (e) {
      console.error("Failed to refresh profile", e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, userPlan, subscriptionExpiry, loading,
      login, register, logout, subscribe, refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
