import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const STATS = [
  { label: "Total Users",       value: "1,284", sub: "↑ 12 this week",   subClass: "up",   icon: "👥", iconBg: "rgba(59,130,246,0.12)"  },
  { label: "Active Subscribers",value: "347",   sub: "↑ 8 today",        subClass: "up",   icon: "💎", iconBg: "rgba(16,185,129,0.12)"  },
  { label: "Revenue Today",     value: "KSH 24,360", sub: "↑ 18% vs yesterday", subClass: "up", icon: "💳", iconBg: "rgba(245,158,11,0.12)" },
  { label: "Tips Posted Today", value: "6",     sub: "3 pending send",   subClass: "",     icon: "⚽", iconBg: "rgba(129,140,248,0.12)" },
];

const RECENT_USERS = [
  { name: "James Otieno",   phone: "0712 345 678", plan: "GOLD",     expiry: "28 Mar 2025", via: "WhatsApp" },
  { name: "Mary Wanjiku",   phone: "0723 456 789", plan: "SILVER",   expiry: "22 Mar 2025", via: "SMS"      },
  { name: "Brian Kipchoge", phone: "0734 567 890", plan: "PLATINUM", expiry: "21 Apr 2025", via: "WhatsApp" },
  { name: "Faith Achieng",  phone: "0745 678 901", plan: "SILVER",   expiry: "23 Mar 2025", via: "SMS"      },
];

const PLAN_BADGE: Record<string, string> = {
  SILVER: "badge-gray", GOLD: "badge-gold", PLATINUM: "badge-purple",
};

const AdminDashboard = () => (
  <AdminLayout title="Dashboard">
    {/* Stats */}
    <div className="stats-grid">
      {STATS.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-card-top">
            <span className="stat-card-label">{s.label}</span>
            <div className="stat-card-icon" style={{ background: s.iconBg }}>{s.icon}</div>
          </div>
          <div className="stat-card-value">{s.value}</div>
          <div className="stat-card-sub">
            <span className={s.subClass}>{s.sub}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Quick Actions */}
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

    {/* Notification Summary */}
    <div className="admin-section" style={{ marginBottom: 20 }}>
      <div className="admin-section-header">
        <span className="admin-section-title">Notification Delivery</span>
      </div>
      <div className="admin-section-body">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
          {[
            { label: "SMS Subscribers",       value: "198", icon: "📱", color: "#10b981" },
            { label: "WhatsApp Subscribers",  value: "149", icon: "💬", color: "#25d366" },
            { label: "Tips Sent Today",       value: "6",   icon: "✅", color: "#60a5fa" },
            { label: "Failed Deliveries",     value: "2",   icon: "⚠️", color: "#f87171" },
          ].map((item) => (
            <div key={item.label} style={{ background: "#162032", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{item.icon}</div>
              <div style={{ color: item.color, fontSize: "1.4rem", fontWeight: 800 }}>{item.value}</div>
              <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 600, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Subscribers */}
    <div className="admin-section">
      <div className="admin-section-header">
        <span className="admin-section-title">Recent Subscribers</span>
        <Link to="/admin/users" className="btn-secondary" style={{ textDecoration: "none", fontSize: "0.8rem" }}>View All</Link>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Phone</th><th>Plan</th><th>Expires</th><th>Receives Via</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_USERS.map((u) => (
              <tr key={u.phone}>
                <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{u.name}</td>
                <td>{u.phone}</td>
                <td><span className={`badge ${PLAN_BADGE[u.plan]}`}>{u.plan}</span></td>
                <td>{u.expiry}</td>
                <td>
                  <span className={`badge ${u.via === "WhatsApp" ? "badge-green" : "badge-blue"}`}>
                    {u.via === "WhatsApp" ? "💬" : "📱"} {u.via}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
);

export default AdminDashboard;
