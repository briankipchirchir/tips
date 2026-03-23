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
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi.getPayments()
      .then((res) => setPayments(res.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter((p) => {
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchSearch = p.phoneNumber?.includes(search) ||
      p.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.mpesaRef?.includes(search);
    return matchStatus && matchSearch;
  });

  const totalRevenue = payments.filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout title="Payments">
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Revenue",   value: `KSH ${totalRevenue.toLocaleString()}`, icon: "💰", bg: "rgba(16,185,129,0.12)"  },
          { label: "Successful",      value: payments.filter((p) => p.status === "SUCCESS").length, icon: "✅", bg: "rgba(16,185,129,0.12)" },
          { label: "Failed",          value: payments.filter((p) => p.status === "FAILED").length,  icon: "❌", bg: "rgba(239,68,68,0.12)"  },
          { label: "Pending",         value: payments.filter((p) => p.status === "PENDING").length, icon: "⏳", bg: "rgba(245,158,11,0.12)" },
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input className="form-input" style={{ width: 200 }}
              placeholder="Search name, phone, ref..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="form-select" style={{ width: "auto" }}
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Date</th><th>User</th><th>Phone</th><th>Plan</th><th>Duration</th><th>Amount</th><th>Ref</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#64748b" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#64748b" }}>No payments yet</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                    {new Date(p.createdAt).toLocaleDateString("en-KE")}
                  </td>
                  <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{p.user?.fullName || "-"}</td>
                  <td>{p.phoneNumber}</td>
                  <td><span className={`badge ${p.planLevel === "GOLD" ? "badge-gold" : p.planLevel === "PLATINUM" ? "badge-purple" : "badge-gray"}`}>{p.planLevel}</span></td>
                  <td style={{ color: "#94a3b8" }}>{p.duration?.replace("_", " ")}</td>
                  <td style={{ color: "#10b981", fontWeight: 700 }}>KSH {p.amount}</td>
                  <td style={{ color: "#475569", fontFamily: "monospace", fontSize: "0.8rem" }}>{p.mpesaRef || p.checkoutRequestId?.slice(0, 15) || "-"}</td>
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
