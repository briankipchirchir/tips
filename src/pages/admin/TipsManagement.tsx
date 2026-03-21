import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

type TipLevel = "FREE" | "SILVER" | "GOLD" | "PLATINUM";

interface Tip {
  id: number;
  time: string;
  league: string;
  fixture: string;
  tip: string;
  odds: string;
  level: TipLevel;
  analysis: string;
  date: string;
  sent: boolean;
}

const INITIAL_TIPS: Tip[] = [
  { id: 1, time: "14:00", league: "EPL",        fixture: "Arsenal vs Chelsea",    tip: "Over 2.5",  odds: "1.85", level: "SILVER",   analysis: "Both teams average 2.8 goals.",  date: "2025-03-22", sent: true  },
  { id: 2, time: "16:30", league: "La Liga",    fixture: "Barcelona vs Atletico", tip: "BTTS",      odds: "1.72", level: "SILVER",   analysis: "BTTS in 7 of last 8 meetings.",  date: "2025-03-22", sent: true  },
  { id: 3, time: "18:45", league: "EPL",        fixture: "Man City vs Liverpool", tip: "Home Win",  odds: "2.10", level: "GOLD",     analysis: "City unbeaten at home in 11.",    date: "2025-03-22", sent: false },
  { id: 4, time: "21:00", league: "UCL",        fixture: "PSG vs Bayern",         tip: "BTTS & O2.5", odds: "1.95", level: "PLATINUM", analysis: "Avg 4.2 goals in last 5 UCL meetings.", date: "2025-03-22", sent: false },
  { id: 5, time: "18:00", league: "FREE",       fixture: "Man City vs Wolves",    tip: "Over 2.5",  odds: "-",    level: "FREE",     analysis: "Free tip for all users.",        date: "2025-03-22", sent: true  },
];

const LEVEL_BADGE: Record<TipLevel, string> = {
  FREE: "badge-blue", SILVER: "badge-gray", GOLD: "badge-gold", PLATINUM: "badge-purple",
};

const EMPTY_FORM = { time: "", league: "", fixture: "", tip: "", odds: "", level: "SILVER" as TipLevel, analysis: "", date: new Date().toISOString().slice(0, 10) };

const TipsManagement = () => {
  const [tips, setTips] = useState<Tip[]>(INITIAL_TIPS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState<number | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>("ALL");

  const filtered = filterLevel === "ALL" ? tips : tips.filter((t) => t.level === filterLevel);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowModal(true); };

  const openEdit = (tip: Tip) => {
    setForm({ time: tip.time, league: tip.league, fixture: tip.fixture, tip: tip.tip, odds: tip.odds, level: tip.level, analysis: tip.analysis, date: tip.date });
    setEditId(tip.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.fixture || !form.tip) return;
    if (editId !== null) {
      setTips(tips.map((t) => t.id === editId ? { ...t, ...form } : t));
    } else {
      setTips([...tips, { ...form, id: Date.now(), sent: false }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this tip?")) setTips(tips.filter((t) => t.id !== id));
  };

  const handleSend = (id: number) => {
    setTips(tips.map((t) => t.id === id ? { ...t, sent: true } : t));
    alert("✅ Tip sent to all eligible subscribers via SMS & WhatsApp!");
  };

  return (
    <AdminLayout title="Tips Management">
      <div className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-title">Today's Tips</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select className="form-select" style={{ width: "auto", padding: "7px 12px" }} value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
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
              <tr>
                <th>Time</th><th>League</th><th>Fixture</th><th>Tip</th><th>Odds</th><th>Package</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tip) => (
                <tr key={tip.id}>
                  <td style={{ color: "#64748b" }}>{tip.time}</td>
                  <td><span className="badge badge-gray">{tip.league}</span></td>
                  <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{tip.fixture}</td>
                  <td style={{ color: "#10b981", fontWeight: 700 }}>{tip.tip}</td>
                  <td style={{ color: "#f59e0b", fontWeight: 700 }}>{tip.odds}</td>
                  <td><span className={`badge ${LEVEL_BADGE[tip.level]}`}>{tip.level}</span></td>
                  <td>
                    {tip.sent
                      ? <span className="badge badge-green">✓ Sent</span>
                      : <span className="badge badge-red">Pending</span>}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {!tip.sent && (
                        <button className="btn-primary" style={{ padding: "5px 10px", fontSize: "0.75rem" }} onClick={() => handleSend(tip.id)}>
                          📤 Send
                        </button>
                      )}
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

      {/* Add/Edit Modal */}
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
                  <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kick-off Time</label>
                  <input className="form-input" type="time" name="time" value={form.time} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">League</label>
                  <input className="form-input" name="league" placeholder="e.g. EPL, UCL, KPL" value={form.league} onChange={handleChange} />
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
                  <input className="form-input" name="fixture" placeholder="e.g. Arsenal vs Chelsea" value={form.fixture} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Prediction / Tip</label>
                  <input className="form-input" name="tip" placeholder="e.g. Over 2.5, BTTS, Home Win" value={form.tip} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Odds</label>
                  <input className="form-input" name="odds" placeholder="e.g. 1.85" value={form.odds} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Analysis</label>
                  <textarea className="form-textarea" name="analysis" placeholder="Brief analysis for subscribers..." value={form.analysis} onChange={handleChange} />
                </div>
              </div>

              {form.level !== "FREE" && (
                <div style={{ marginTop: 16, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, padding: "12px 14px" }}>
                  <p style={{ color: "#6ee7b7", fontSize: "0.8rem", margin: 0 }}>
                    📤 After saving, click <strong>Send</strong> on the tip row to push it to all <strong>{form.level}</strong>+ subscribers via their chosen channel (SMS or WhatsApp).
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>
                {editId ? "Save Changes" : "Add Tip"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TipsManagement;
