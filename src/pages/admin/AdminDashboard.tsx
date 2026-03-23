import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/api";

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  successfulPayments: number;
}

interface User {
  id: string;
  fullName: string;
  phone: string;
  smsNumber: string;
  role: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, activeSubscriptions: 0, totalRevenue: 0, successfulPayments: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getUsers()])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data);
        setRecentUsers(usersRes.data.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: "Total Users",         value: stats.totalUsers,          icon: "👥", bg: "rgba(59,130,246,0.12)"  },
    { label: "Active Subscribers",  value: stats.activeSubscriptions, icon: "💎", bg: "rgba(16,185,129,0.12)"  },
    { label: "Revenue (KSH)",       value: stats.totalRevenue,        icon: "💳", bg: "rgba(245,158,11,0.12)"  },
    { label: "Successful Payments", value: stats.successfulPayments,  icon: "✅", bg: "rgba(129,140,248,0.12)" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="stats-grid">
        {STAT_CARDS.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-top">
              <span className="stat-card-label">{s.label}</span>
              <div className="stat-card-icon" style={{ background: s.bg }}>{s.icon}</div>
            </div>
            <div className="stat-card-value">{loading ? "..." : s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="admin-section" style={{ marginBottom: 20 }}>
        <div className="admin-section-header">
          <span className="admin-section-title">Quick Actions</span>
        </div>
        <div className="admin-section-body" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/tips" className="btn-primary">⚽ Post Today's Tips</Link>
          <Link to="/admin/value-bets" className="btn-primary">🎯 Post Value Bets</Link>
          <Link to="/admin/users" className="btn-secondary">👥 View Subscribers</Link>
          <Link to="/admin/payments" className="btn-secondary">💳 View Payments</Link>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-title">Recent Users</span>
          <Link to="/admin/users" className="btn-secondary" style={{ textDecoration: "none", fontSize: "0.8rem" }}>View All</Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>SMS Number</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#64748b" }}>Loading...</td></tr>
              ) : recentUsers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#64748b" }}>No users yet</td></tr>
              ) : recentUsers.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{u.fullName}</td>
                  <td>{u.phone}</td>
                  <td>{u.smsNumber}</td>
                  <td><span className={`badge ${u.role === "ADMIN" ? "badge-purple" : "badge-green"}`}>{u.role}</span></td>
                  <td style={{ color: "#64748b" }}>{new Date(u.createdAt).toLocaleDateString("en-KE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
