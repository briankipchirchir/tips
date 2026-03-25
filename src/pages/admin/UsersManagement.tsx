import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/api";

interface User {
  id: string;
  fullName: string;
  phone: string;
  smsNumber: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  phoneNumber: string;
  planLevel: string;
  duration: string;   // e.g. "ONE_WEEK", "ONE_MONTH", "THREE_MONTHS"
  status: string;
  createdAt: string;
  completedAt: string;
  user: { fullName: string; phone: string };
}

interface DerivedSub {
  planLevel: string;
  startedAt: string;
  expiresAt: string;
  isActive: boolean;
}

// Map duration string → days
const DURATION_DAYS: Record<string, number> = {
  ONE_DAY:       1,
  THREE_DAYS:    3,
  ONE_WEEK:      7,
  TWO_WEEKS:     14,
  ONE_MONTH:     30,
  THREE_MONTHS:  90,
  SIX_MONTHS:    180,
  ONE_YEAR:      365,
};

const PLAN_BADGE: Record<string, string> = {
  FREE:     "badge-blue",
  SILVER:   "badge-gray",
  GOLD:     "badge-gold",
  PLATINUM: "badge-purple",
};

const daysUntil = (dateStr: string) =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

const ExpiryCell = ({ sub }: { sub?: DerivedSub | null }) => {
  if (!sub) return <span style={{ color: "#475569", fontSize: "0.82rem" }}>—</span>;

  const days      = daysUntil(sub.expiresAt);
  const dateLabel = new Date(sub.expiresAt).toLocaleDateString("en-KE");

  if (!sub.isActive || days < 0)
    return <span style={{ color: "#ef4444", fontSize: "0.82rem" }}>Expired {dateLabel}</span>;

  const color = days <= 3 ? "#f59e0b" : "#10b981";
  return (
    <span style={{ color, fontSize: "0.82rem" }}>
      {dateLabel}
      <span style={{ marginLeft: 6, fontWeight: 700 }}>({days}d left)</span>
    </span>
  );
};

/** Build a map of phone → most recent active subscription derived from payments */
const buildSubMap = (payments: Payment[]): Map<string, DerivedSub> => {
  const map = new Map<string, DerivedSub>();

  // Only successful payments, newest first
  const successful = [...payments]
    .filter((p) => p.status === "SUCCESS")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  for (const p of successful) {
    const key = p.phoneNumber || p.user?.phone;
    if (!key || map.has(key)) continue; // keep only the latest per phone

    const days      = DURATION_DAYS[p.duration] ?? 30;
    const startedAt = p.completedAt || p.createdAt;
    const expiresAt = new Date(
      new Date(startedAt).getTime() + days * 24 * 60 * 60 * 1000
    ).toISOString();
    const isActive  = new Date(expiresAt).getTime() > Date.now();

    map.set(key, { planLevel: p.planLevel, startedAt, expiresAt, isActive });
  }

  return map;
};

const UsersManagement = () => {
  const [users, setUsers]           = useState<User[]>([]);
  const [subMap, setSubMap]         = useState<Map<string, DerivedSub>>(new Map());
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");

  useEffect(() => {
    Promise.all([adminApi.getUsers(), adminApi.getPayments()])
      .then(([usersRes, paymentsRes]) => {
        setUsers(usersRes.data);
        setSubMap(buildSubMap(paymentsRes.data));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const sub = subMap.get(u.phone);

    const matchSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.smsNumber?.includes(search);

    const matchDate = filterDate
      ? new Date(u.createdAt).toISOString().slice(0, 10) === filterDate
      : true;

    const matchPlan =
      filterPlan === "ALL"    ? true
      : filterPlan === "NONE" ? !sub
      : sub?.planLevel === filterPlan;

    return matchSearch && matchDate && matchPlan;
  });

  const activeSubs  = users.filter((u) => subMap.get(u.phone)?.isActive).length;
  const expiredSubs = users.filter((u) => {
    const s = subMap.get(u.phone);
    return s && !s.isActive;
  }).length;
  const noSub = users.filter((u) => !subMap.get(u.phone)).length;

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

            <input
              className="form-input"
              style={{ width: 200 }}
              placeholder="Search name, phone, SMS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

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
              ) : filtered.map((u) => {
                const sub = subMap.get(u.phone);
                return (
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
                      {sub ? (
                        <span className={`badge ${PLAN_BADGE[sub.planLevel] ?? "badge-gray"}`}>
                          {sub.planLevel}
                        </span>
                      ) : (
                        <span style={{ color: "#475569", fontSize: "0.82rem" }}>None</span>
                      )}
                    </td>
                    <td><ExpiryCell sub={sub} /></td>
                    <td style={{ color: "#64748b" }}>
                      {new Date(u.createdAt).toLocaleDateString("en-KE")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;