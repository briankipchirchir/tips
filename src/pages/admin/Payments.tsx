import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface Payment {
  id: string;
  name: string;
  phone: string;
  amount: number;
  plan: string;
  duration: string;
  via: string;
  status: "success" | "failed" | "pending";
  date: string;
  mpesaRef: string;
}

const PAYMENTS: Payment[] = [
  { id: "1", name: "James Otieno",   phone: "0712345678", amount: 380,  plan: "GOLD",     duration: "1 Week",  via: "WhatsApp", status: "success", date: "2025-03-21 14:32", mpesaRef: "QHJ83KL2MN" },
  { id: "2", name: "Mary Wanjiku",   phone: "0723456789", amount: 50,   plan: "SILVER",   duration: "1 Day",   via: "SMS",      status: "success", date: "2025-03-21 13:10", mpesaRef: "QHJ84KL3MP" },
  { id: "3", name: "Brian Kipchoge", phone: "0734567890", amount: 1800, plan: "PLATINUM", duration: "1 Month", via: "Both",     status: "success", date: "2025-03-20 09:45", mpesaRef: "QHJ85KL4MQ" },
  { id: "4", name: "Faith Achieng",  phone: "0745678901", amount: 120,  plan: "SILVER",   duration: "3 Days",  via: "SMS",      status: "failed",  date: "2025-03-20 08:20", mpesaRef: "-"          },
  { id: "5", name: "Kevin Mwangi",   phone: "0756789012", amount: 70,   plan: "GOLD",     duration: "1 Day",   via: "WhatsApp", status: "success", date: "2025-03-19 19:55", mpesaRef: "QHJ86KL5MR" },
  { id: "6", name: "Linet Auma",     phone: "0767890123", amount: 500,  plan: "PLATINUM", duration: "1 Week",  via: "WhatsApp", status: "pending", date: "2025-03-21 15:00", mpesaRef: "Pending"    },
];

const STATUS_BADGE: Record<string, string> = {
  success: "badge-green", failed: "badge-red", pending: "badge-gold",
};

const PaymentsAdmin = () => {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = PAYMENTS.filter((p) => {
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search) || p.mpesaRef.includes(search);
    return matchStatus && matchSearch;
  });

  const totalRevenue = PAYMENTS.filter((p) => p.status === "success").reduce((sum, p) => sum + p.amount, 0);
  const successCount = PAYMENTS.filter((p) => p.status === "success").length;
  const failedCount  = PAYMENTS.filter((p) => p.status === "failed").length;
  const pendingCount = PAYMENTS.filter((p) => p.status === "pending").length;

  return (
    <AdminLayout title="Payments">
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Revenue",    value: `KSH ${totalRevenue.toLocaleString()}`, icon: "💰", bg: "rgba(16,185,129,0.12)"  },
          { label: "Successful",       value: successCount, icon: "✅", bg: "rgba(16,185,129,0.12)"  },
          { label: "Failed",           value: failedCount,  icon: "❌", bg: "rgba(239,68,68,0.12)"   },
          { label: "Pending",          value: pendingCount, icon: "⏳", bg: "rgba(245,158,11,0.12)"  },
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
          <span className="admin-section-title">M-Pesa Transactions</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input className="form-input" style={{ width: 200 }} placeholder="Search name, phone, ref..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="form-select" style={{ width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th><th>Name</th><th>Phone</th><th>Plan</th><th>Duration</th><th>Amount</th><th>Via</th><th>M-Pesa Ref</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>{p.date}</td>
                  <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{p.name}</td>
                  <td>{p.phone}</td>
                  <td><span className={`badge ${p.plan === "GOLD" ? "badge-gold" : p.plan === "PLATINUM" ? "badge-purple" : "badge-gray"}`}>{p.plan}</span></td>
                  <td style={{ color: "#94a3b8" }}>{p.duration}</td>
                  <td style={{ color: "#10b981", fontWeight: 700 }}>KSH {p.amount}</td>
                  <td><span className={`badge ${p.via === "WhatsApp" ? "badge-green" : p.via === "Both" ? "badge-blue" : "badge-blue"}`}>{p.via === "WhatsApp" ? "💬" : p.via === "Both" ? "📱💬" : "📱"} {p.via}</span></td>
                  <td style={{ color: "#475569", fontFamily: "monospace", fontSize: "0.8rem" }}>{p.mpesaRef}</td>
                  <td><span className={`badge ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
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
