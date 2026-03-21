import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  via: "SMS" | "WhatsApp" | "Both";
  expiry: string;
  status: "active" | "expired";
  joined: string;
}

const USERS: User[] = [
  { id: 1, name: "James Otieno",   email: "james@email.com",  phone: "0712345678", plan: "GOLD",     via: "WhatsApp", expiry: "2025-03-28", status: "active",  joined: "2025-03-01" },
  { id: 2, name: "Mary Wanjiku",   email: "mary@email.com",   phone: "0723456789", plan: "SILVER",   via: "SMS",      expiry: "2025-03-22", status: "active",  joined: "2025-03-15" },
  { id: 3, name: "Brian Kipchoge", email: "brian@email.com",  phone: "0734567890", plan: "PLATINUM", via: "Both",     expiry: "2025-04-21", status: "active",  joined: "2025-02-20" },
  { id: 4, name: "Faith Achieng",  email: "faith@email.com",  phone: "0745678901", plan: "SILVER",   via: "SMS",      expiry: "2025-03-18", status: "expired", joined: "2025-03-10" },
  { id: 5, name: "Kevin Mwangi",   email: "kevin@email.com",  phone: "0756789012", plan: "GOLD",     via: "WhatsApp", expiry: "2025-04-05", status: "active",  joined: "2025-03-05" },
  { id: 6, name: "Linet Auma",     email: "linet@email.com",  phone: "0767890123", plan: "PLATINUM", via: "WhatsApp", expiry: "2025-03-15", status: "expired", joined: "2025-02-15" },
];

const PLAN_BADGE: Record<string, string> = {
  SILVER: "badge-gray", GOLD: "badge-gold", PLATINUM: "badge-purple", NONE: "badge-gray",
};

const UsersManagement = () => {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    const matchPlan = filterPlan === "ALL" || u.plan === filterPlan;
    const matchStatus = filterStatus === "ALL" || u.status === filterStatus;
    return matchSearch && matchPlan && matchStatus;
  });

  const activeCount = USERS.filter((u) => u.status === "active").length;
  const expiredCount = USERS.filter((u) => u.status === "expired").length;

  return (
    <AdminLayout title="Users Management">
      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", marginBottom: 20 }}>
        {[
          { label: "Total Users",    value: USERS.length,  icon: "👥", bg: "rgba(59,130,246,0.12)"  },
          { label: "Active Subs",    value: activeCount,   icon: "✅", bg: "rgba(16,185,129,0.12)"  },
          { label: "Expired",        value: expiredCount,  icon: "⚠️", bg: "rgba(239,68,68,0.12)"   },
          { label: "SMS Users",      value: USERS.filter((u) => u.via === "SMS" || u.via === "Both").length, icon: "��", bg: "rgba(96,165,250,0.12)" },
          { label: "WhatsApp Users", value: USERS.filter((u) => u.via === "WhatsApp" || u.via === "Both").length, icon: "💬", bg: "rgba(37,211,102,0.12)" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-top">
              <span className="stat-card-label">{s.label}</span>
              <div className="stat-card-icon" style={{ background: s.bg }}>{s.icon}</div>
            </div>
            <div className="stat-card-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-title">All Users</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input className="form-input" style={{ width: 180 }} placeholder="Search name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="form-select" style={{ width: "auto" }} value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}>
              <option value="ALL">All Plans</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
            </select>
            <select className="form-select" style={{ width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Phone</th><th>Plan</th><th>Receives Via</th><th>Expiry</th><th>Status</th><th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ color: "#f1f5f9", fontWeight: 600 }}>{u.name}</div>
                    <div style={{ color: "#475569", fontSize: "0.78rem" }}>{u.email}</div>
                  </td>
                  <td>{u.phone}</td>
                  <td><span className={`badge ${PLAN_BADGE[u.plan]}`}>{u.plan}</span></td>
                  <td>
                    <span className={`badge ${u.via === "WhatsApp" ? "badge-green" : u.via === "Both" ? "badge-blue" : "badge-blue"}`}>
                      {u.via === "WhatsApp" ? "💬" : u.via === "Both" ? "📱💬" : "📱"} {u.via}
                    </span>
                  </td>
                  <td style={{ color: u.status === "expired" ? "#f87171" : "#94a3b8" }}>{u.expiry}</td>
                  <td>
                    <span className={`badge ${u.status === "active" ? "badge-green" : "badge-red"}`}>
                      {u.status === "active" ? "● Active" : "● Expired"}
                    </span>
                  </td>
                  <td style={{ color: "#64748b" }}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;
