import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/api";

interface Payment {
  id: string;
  amount: number;
  phoneNumber: string;
  planLevel: string;
  duration: string;
  status: string;
  mpesaRef: string;
  checkoutRequestId: string;
  createdAt: string;
  completedAt: string;
  user: { fullName: string; phone: string };
}

const STATUS_BADGE: Record<string, string> = {
  SUCCESS: "badge-green", FAILED: "badge-red", PENDING: "badge-gold",
};

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.getPayments()
      .then((res) => setPayments(res.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter((p) => {
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchSearch =
      p.phoneNumber?.includes(search) ||
      p.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.mpesaRef?.includes(search);
    const matchDate = filterDate
      ? new Date(p.createdAt).toISOString().slice(0, 10) === filterDate
      : true;
    return matchStatus && matchSearch && matchDate;
  });

  // Summary stats computed from the date-filtered subset (ignoring status filter for totals)
  const dateFiltered = payments.filter((p) =>
    filterDate ? new Date(p.createdAt).toISOString().slice(0, 10) === filterDate : true
  );
  const totalRevenue = dateFiltered
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout title="Payments">
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Revenue",  value: `KSH ${totalRevenue.toLocaleString()}`,                    icon: "💰", bg: "rgba(16,185,129,0.12)"  },
          { label: "Successful",     value: dateFiltered.filter((p) => p.status === "SUCCESS").length,  icon: "✅", bg: "rgba(16,185,129,0.12)"  },
          { label: "Failed",         value: dateFiltered.filter((p) => p.status === "FAILED").length,   icon: "❌", bg: "rgba(239,68,68,0.12)"   },
          { label: "Pending",        value: dateFiltered.filter((p) => p.status === "PENDING").length,  icon: "⏳", bg: "rgba(245,158,11,0.12)"  },
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
          <span className="admin-section-title">M-Pesa Transactions</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {/* ── Date picker ── */}
            <input
              className="form-input"
              type="date"
              style={{ width: "auto" }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              title="Filter by transaction date"
            />
            {filterDate && (
              <button
                className="btn-secondary"
                style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                onClick={() => setFilterDate("")}
              >
                ✕ Clear
              </button>
            )}
            <input
              className="form-input"
              style={{ width: 200 }}
              placeholder="Search name, phone, ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-select"
              style={{ width: "auto" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {filterDate && (
          <div style={{ padding: "8px 16px", background: "rgba(59,130,246,0.08)", borderBottom: "1px solid #1e293b", fontSize: "0.82rem", color: "#94a3b8" }}>
            Showing transactions on{" "}
            <strong style={{ color: "#f1f5f9" }}>
              {new Date(filterDate + "T00:00:00").toLocaleDateString("en-KE", { dateStyle: "long" })}
            </strong>
            {" "}— {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Date</th><th>User</th><th>Phone</th><th>Plan</th><th>Duration</th><th>Amount</th><th>Ref</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#64748b" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#64748b" }}>No payments found</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                    {new Date(p.createdAt).toLocaleDateString("en-KE")}
                  </td>
                  <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{p.user?.fullName || "-"}</td>
                  <td>{p.phoneNumber}</td>
                  <td>
                    <span className={`badge ${p.planLevel === "GOLD" ? "badge-gold" : p.planLevel === "PLATINUM" ? "badge-purple" : "badge-gray"}`}>
                      {p.planLevel}
                    </span>
                  </td>
                  <td style={{ color: "#94a3b8" }}>{p.duration?.replace("_", " ")}</td>
                  <td style={{ color: "#10b981", fontWeight: 700 }}>KSH {p.amount}</td>
                  <td style={{ color: "#475569", fontFamily: "monospace", fontSize: "0.8rem" }}>
                    {p.mpesaRef || p.checkoutRequestId?.slice(0, 15) || "-"}
                  </td>
                  <td><span className={`badge ${STATUS_BADGE[p.status] || "badge-gray"}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentsAdmin;