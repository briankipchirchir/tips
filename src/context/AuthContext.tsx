import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type PlanLevel = "FREE" | "SILVER" | "GOLD" | "PLATINUM" | "NONE";
type Duration = "1day" | "3days" | "1week" | "1month";

interface UserData {
  fullName: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: UserData | null;
  userPlan: PlanLevel;
  subscriptionExpiry: string | null;
  login: (email: string, password: string) => void;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  subscribe: (plan: PlanLevel, duration: Duration) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DURATION_DAYS: Record<Duration, number> = {
  "1day": 1,
  "3days": 3,
  "1week": 7,
  "1month": 30,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userPlan, setUserPlan] = useState<PlanLevel>("NONE");
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null);

  const login = (email: string, _password: string) => {
    // TODO: Replace with Keycloak authentication
    setUser({ fullName: "John Kamau", email, phone: "0712345678" });
    setUserPlan("NONE");
  };

  const register = async (
    fullName: string,
    email: string,
    phone: string,
    _password: string
  ): Promise<void> => {
    // TODO: Replace with Keycloak registration API call
    await new Promise((r) => setTimeout(r, 800));
    setUser({ fullName, email, phone });
    setUserPlan("NONE");
  };

  const logout = () => {
    setUser(null);
    setUserPlan("NONE");
    setSubscriptionExpiry(null);
  };

  const subscribe = (plan: PlanLevel, duration: Duration) => {
    const days = DURATION_DAYS[duration];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    setUserPlan(plan);
    setSubscriptionExpiry(expiry.toISOString());
  };

  return (
    <AuthContext.Provider
      value={{ user, userPlan, subscriptionExpiry, login, register, logout, subscribe }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
