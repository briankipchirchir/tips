import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/api";

type TipLevel = "FREE" | "SILVER" | "GOLD" | "PLATINUM";

interface Tip {
  id: string;
  time?: string;
  kickoffTime: string;
  league: string;
  fixture: string;
  prediction: string;
  odds: string;
  level: TipLevel;
  analysis: string;
  gameDate: string;
  sent: boolean;
   status: "PENDING" | "WON" | "LOST";
}

const LEVEL_BADGE: Record<TipLevel, string> = {
  FREE: "badge-blue", SILVER: "badge-gray", GOLD: "badge-gold", PLATINUM: "badge-purple",
};

const EMPTY_FORM = {
  league: "", fixture: "", kickoffTime: "", gameDate: new Date().toISOString().slice(0, 10),
  prediction: "", odds: "", level: "SILVER" as TipLevel, analysis: "",
};

const TipsManagement = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const fetchTips = () => {
    setLoading(true);
    adminApi.getTips(today)
      .then((res) => setTips(res.data))
      .catch(() => setTips([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTips(); }, []);

  const filtered = filterLevel === "ALL" ? tips : tips.filter((t) => t.level === filterLevel);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowModal(true); };
  const openEdit = (tip: Tip) => {
    setForm({ league: tip.league, fixture: tip.fixture, kickoffTime: tip.kickoffTime,
      gameDate: tip.gameDate, prediction: tip.prediction, odds: tip.odds || "",
      level: tip.level, analysis: tip.analysis || "" });
    setEditId(tip.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.fixture || !form.prediction) return;
    setSaving(true);
    try {
      if (editId) {
        await adminApi.updateTip(editId, form);
      } else {
        await adminApi.createTip(form);
      }
      fetchTips();
      setShowModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tip?")) return;
    await adminApi.deleteTip(id);
    fetchTips();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
  try {
    await adminApi.updateTipStatus(id, status);
    fetchTips();
  } catch (e) {
    console.error(e);
  }
};

  return (
    <AdminLayout title="Tips Management">
      <div className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-title">Today's Tips</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select className="form-select" style={{ width: "auto", padding: "7px 12px" }}
              value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="ALL">All Levels</option>
              <option value="FREE">Free</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
            </select>
            <button className="btn-primary" onClick={openAdd}>+ Add Tip</button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Time</th><th>League</th><th>Fixture</th><th>Tip</th><th>Odds</th><th>Package</th><th>Sent</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#64748b" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#64748b" }}>No tips yet. Click + Add Tip.</td></tr>
              ) : filtered.map((tip) => (
                <tr key={tip.id}>
                  <td style={{ color: "#64748b" }}>{tip.kickoffTime}</td>
                  <td><span className="badge badge-gray">{tip.league}</span></td>
                  <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{tip.fixture}</td>
                  <td style={{ color: "#10b981", fontWeight: 700 }}>{tip.prediction}</td>
                  <td style={{ color: "#f59e0b", fontWeight: 700 }}>{tip.odds || "-"}</td>
                  <td><span className={`badge ${LEVEL_BADGE[tip.level]}`}>{tip.level}</span></td>
                  <td>{tip.sent ? <span className="badge badge-green">✓ Sent</span> : <span className="badge badge-red">Pending</span>}</td>
                  <td>
  <select
    value={tip.status}
    onChange={(e) => handleStatusUpdate(tip.id, e.target.value)}
    style={{
      background: tip.status === "WON" ? "#064e3b" : tip.status === "LOST" ? "#7f1d1d" : "#1e293b",
      color: tip.status === "WON" ? "#10b981" : tip.status === "LOST" ? "#ef4444" : "#94a3b8",
      border: "none",
      borderRadius: "6px",
      padding: "4px 8px",
      fontWeight: 600,
      cursor: "pointer"
    }}
  >
    <option value="PENDING">⏳ Pending</option>
    <option value="WON">✅ Won</option>
    <option value="LOST">❌ Lost</option>
  </select>
</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-icon" onClick={() => openEdit(tip)}>✏️</button>
                      <button className="btn-danger" onClick={() => handleDelete(tip.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editId ? "Edit Tip" : "Add New Tip"}</span>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" name="gameDate" value={form.gameDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kick-off Time</label>
                  <input className="form-input" type="time" name="kickoffTime" value={form.kickoffTime} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">League</label>
                  <input className="form-input" name="league" placeholder="EPL, UCL, KPL..." value={form.league} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Package</label>
                  <select className="form-select" name="level" value={form.level} onChange={handleChange}>
                    <option value="FREE">Free</option>
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                    <option value="PLATINUM">Platinum</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label className="form-label">Fixture</label>
                  <input className="form-input" name="fixture" placeholder="Arsenal vs Chelsea" value={form.fixture} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Prediction</label>
                  <input className="form-input" name="prediction" placeholder="Over 2.5, BTTS, Home Win..." value={form.prediction} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Odds</label>
                  <input className="form-input" name="odds" placeholder="1.85" value={form.odds} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Analysis</label>
                  <textarea className="form-textarea" name="analysis" placeholder="Brief analysis..." value={form.analysis} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Tip"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TipsManagement;
