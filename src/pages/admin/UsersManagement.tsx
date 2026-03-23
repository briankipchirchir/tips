import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/api";

interface User {
  id: string;
  fullName: string;
  phone: string;
  smsNumber: string;
  role: string;
  createdAt: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <AdminLayout title="Users Management">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", marginBottom: 20 }}>
        {[
          { label: "Total Users", value: users.length,                                   icon: "👥", bg: "rgba(59,130,246,0.12)"  },
          { label: "Admins",      value: users.filter((u) => u.role === "ADMIN").length,  icon: "🔑", bg: "rgba(245,158,11,0.12)"  },
          { label: "Regular",     value: users.filter((u) => u.role === "USER").length,   icon: "👤", bg: "rgba(16,185,129,0.12)"  },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-top">
              <span className="stat-card-label">{s.label}</span>
              <div className="stat-card-icon" style={{ background: s.bg }}>{s.icon}</div>
            </div>
            <div className="stat-card-value">{loading ? "..." : s.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-title">All Users</span>
          <input className="form-input" style={{ width: 200 }}
            placeholder="Search name or phone..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>SMS Number</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#64748b" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#64748b" }}>No users found</td></tr>
              ) : filtered.map((u) => (
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

export default UsersManagement;
