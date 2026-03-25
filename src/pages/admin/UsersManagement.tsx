import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/api";

interface Subscription {
  planLevel: string;
  expiresAt: string;
  isActive: boolean;
}

interface User {
  id: string;
  fullName: string;
  phone: string;
  smsNumber: string;
  role: string;
  createdAt: string;
  subscription?: Subscription | null;
}

const PLAN_BADGE: Record<string, string> = {
  FREE:     "badge-blue",
  SILVER:   "badge-gray",
  GOLD:     "badge-gold",
  PLATINUM: "badge-purple",
};

/** Returns how many days until expiry (negative = already expired) */
const daysUntil = (dateStr: string) =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

const ExpiryCell = ({ sub }: { sub?: Subscription | null }) => {
  if (!sub) return <span style={{ color: "#475569", fontSize: "0.82rem" }}>—</span>;

  const days      = daysUntil(sub.expiresAt);
  const dateLabel = new Date(sub.expiresAt).toLocaleDateString("en-KE");

  if (!sub.isActive || days < 0) {
    return <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>Expired {dateLabel}</span>;
  }

  const color = days <= 3 ? "#f59e0b" : "#10b981";
  return (
    <span style={{ color, fontSize: "0.82rem" }}>
      {dateLabel}
      <span style={{ marginLeft: 6, fontWeight: 700 }}>({days}d left)</span>
    </span>
  );
};

const UsersManagement = () => {
  const [users, setUsers]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");

  useEffect(() => {
    adminApi.getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.smsNumber?.includes(search);

    const matchDate = filterDate
      ? new Date(u.createdAt).toISOString().slice(0, 10) === filterDate
      : true;

    const matchPlan =
      filterPlan === "ALL"   ? true
      : filterPlan === "NONE" ? !u.subscription
      : u.subscription?.planLevel === filterPlan;

    return matchSearch && matchDate && matchPlan;
  });

  const activeSubs  = users.filter((u) => u.subscription?.isActive).length;
  const expiredSubs = users.filter((u) => u.subscription && !u.subscription.isActive).length;
  const noSub       = users.filter((u) => !u.subscription).length;

  return (
    <AdminLayout title="Users Management">

      {/* ── Stat cards ── */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", marginBottom: 20 }}
      >
        {[
          { label: "Total Users",     value: users.length, icon: "👥", bg: "rgba(59,130,246,0.12)"  },
          { label: "Active Subs",     value: activeSubs,   icon: "💎", bg: "rgba(16,185,129,0.12)"  },
          { label: "Expired Subs",    value: expiredSubs,  icon: "⏰", bg: "rgba(239,68,68,0.12)"   },
          { label: "No Subscription", value: noSub,        icon: "👤", bg: "rgba(100,116,139,0.12)" },
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>

            {/* Date filter */}
            <input
              className="form-input"
              type="date"
              style={{ width: "auto" }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              title="Filter by join date"
            />
            {filterDate && (
              <button
                className="btn-secondary"
                style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                onClick={() => setFilterDate("")}
              >
                ✕ Date
              </button>
            )}

            {/* Plan filter */}
            <select
              className="form-select"
              style={{ width: "auto" }}
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
            >
              <option value="ALL">All Plans</option>
              <option value="FREE">Free</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
              <option value="NONE">No Subscription</option>
            </select>

            {/* Search */}
            <input
              className="form-input"
              style={{ width: 200 }}
              placeholder="Search name, phone, SMS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Active-filter banner */}
        {(filterDate || filterPlan !== "ALL") && (
          <div style={{
            padding: "8px 16px",
            background: "rgba(59,130,246,0.08)",
            borderBottom: "1px solid #1e293b",
            fontSize: "0.82rem",
            color: "#94a3b8",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}>
            {filterDate && (
              <span>
                Joined:{" "}
                <strong style={{ color: "#f1f5f9" }}>
                  {new Date(filterDate + "T00:00:00").toLocaleDateString("en-KE", { dateStyle: "long" })}
                </strong>
              </span>
            )}
            {filterPlan !== "ALL" && (
              <span>Plan: <strong style={{ color: "#f1f5f9" }}>{filterPlan}</strong></span>
            )}
            <span style={{ marginLeft: "auto" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>SMS Number</th>
                <th>Role</th>
                <th>Plan</th>
                <th>Expiry</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#64748b" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#64748b" }}>No users found</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{u.fullName}</td>
                  <td>{u.phone}</td>
                  <td>{u.smsNumber || "—"}</td>
                  <td>
                    <span className={`badge ${u.role === "ADMIN" ? "badge-purple" : "badge-green"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.subscription ? (
                      <span className={`badge ${PLAN_BADGE[u.subscription.planLevel] ?? "badge-gray"}`}>
                        {u.subscription.planLevel}
                      </span>
                    ) : (
                      <span style={{ color: "#475569", fontSize: "0.82rem" }}>None</span>
                    )}
                  </td>
                  <td><ExpiryCell sub={u.subscription} /></td>
                  <td style={{ color: "#64748b" }}>
                    {new Date(u.createdAt).toLocaleDateString("en-KE")}
                  </td>
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