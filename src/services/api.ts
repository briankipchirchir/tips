import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });
          const newToken = res.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authApi = {
  register: (data: { fullName: string; phone: string; smsNumber?: string; password: string }) =>
    api.post("/api/auth/register", data),
  login: (data: { phone: string; password: string }) =>
    api.post("/api/auth/login", data),
  logout: () => api.post("/api/auth/logout"),
  refresh: (refreshToken: string) =>
    api.post("/api/auth/refresh", { refreshToken }),
};

// ── Tips ──
export const tipsApi = {
  getFreeTips: (date?: string) =>
    api.get("/api/tips/free", { params: date ? { date } : {} }),
  getPremiumTips: (date?: string) =>
    api.get("/api/tips/premium", { params: date ? { date } : {} }),
};

// ── Value Bets ──
export const valueBetsApi = {
  getByCategory: (category: string) =>
    api.get(`/api/value-bets/${category}`),
};

// ── User ──
export const userApi = {
  getProfile: () => api.get("/api/users/me"),
  updateSmsNumber: (smsNumber: string) =>
    api.put("/api/users/me/sms-number", null, { params: { smsNumber } }),
};

// ── Payments ──
export const paymentsApi = {
  initiateStk: (data: {
    mpesaPhone: string;
    smsPhone: string;
    planLevel: string;
    duration: string;
  }) => api.post("/api/payments/mpesa/stk", data),
};

// ── Admin ──
export const adminApi = {
  getStats: () => api.get("/api/admin/stats"),
  getTips: (date?: string) =>
    api.get("/api/admin/tips", { params: date ? { date } : {} }),
  createTip: (data: object) => api.post("/api/admin/tips", data),
  updateTip: (id: string, data: object) => api.put(`/api/admin/tips/${id}`, data),
  deleteTip: (id: string) => api.delete(`/api/admin/tips/${id}`),
  getValueBets: (category: string) =>
    api.get(`/api/admin/value-bets/${category}`),
  createValueBet: (data: object) => api.post("/api/admin/value-bets", data),
  updateValueBet: (id: string, data: object) =>
    api.put(`/api/admin/value-bets/${id}`, data),
  deleteValueBet: (id: string) => api.delete(`/api/admin/value-bets/${id}`),
  getUsers: () => api.get("/api/admin/users"),
  getPayments: () => api.get("/api/admin/payments"),
};

export default api;
