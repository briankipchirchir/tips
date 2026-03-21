import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

type VBCategory = "sportpesa" | "betika" | "correct-score" | "goal-range";

interface VBPrediction {
  id: number;
  matchNum: number;
  league: string;
  date: string;
  fixture: string;
  pick: string;
  odds: string;
  confidence: number;
  analysis: string;
  category: VBCategory;
  sent: boolean;
}

const INITIAL: VBPrediction[] = [
  { id: 1, matchNum: 1, league: "EPL",     date: "2025-03-22", fixture: "Arsenal vs Chelsea",    pick: "1",        odds: "2.10", confidence: 82, analysis: "Arsenal strong at home.",    category: "sportpesa",     sent: true  },
  { id: 2, matchNum: 2, league: "La Liga", date: "2025-03-22", fixture: "Barcelona vs Sevilla",  pick: "1",        odds: "1.75", confidence: 88, analysis: "Barca on a 6-game streak.",  category: "sportpesa",     sent: true  },
  { id: 3, matchNum: 1, league: "EPL",     date: "2025-03-19", fixture: "Man City vs Wolves",    pick: "1",        odds: "1.55", confidence: 91, analysis: "City 9 consecutive home wins.", category: "betika",      sent: false },
  { id: 4, matchNum: 1, league: "EPL",     date: "2025-03-22", fixture: "Arsenal vs Chelsea",    pick: "2-1",      odds: "8.50", confidence: 68, analysis: "2-1 common scoreline.",      category: "correct-score", sent: false },
  { id: 5, matchNum: 1, league: "EPL",     date: "2025-03-22", fixture: "Arsenal vs Chelsea",    pick: "Over 2.5", odds: "1.85", confidence: 84, analysis: "3+ goals in 8 of last 10.",  category: "goal-range",    sent: true  },
];

const TABS: { key: VBCategory; label: string }[] = [
  { key: "sportpesa",     label: "SportPesa" },
  { key: "betika",        label: "Betika" },
  { key: "correct-score", label: "Correct Score" },
  { key: "goal-range",    label: "Goal Range" },
];

const EMPTY_FORM = { matchNum: 1, league: "", date: new Date().toISOString().slice(0, 10), fixture: "", pick: "", odds: "", confidence: 75, analysis: "" };

const ValueBetsAdmin = () => {
  const [predictions, setPredictions] = useState<VBPrediction[]>(INITIAL);
  const [activeTab, setActiveTab] = useState<VBCategory>("sportpesa");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState<number | null>(null);

  const filtered = predictions.filter((p) => p.category === activeTab);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.name === "matchNum" || e.target.name === "confidence" ? Number(e.target.value) : e.target.value });
  };

  const openAdd = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowModal(true); };
  const openEdit = (p: VBPrediction) => {
    setForm({ matchNum: p.matchNum, league: p.league, date: p.date, fixture: p.fixture, pick: p.pick, odds: p.odds, confidence: p.confidence, analysis: p.analysis });
    setEditId(p.id); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.fixture || !form.pick) return;
    if (editId !== null) {
      setPredictions(predictions.map((p) => p.id === editId ? { ...p, ...form } : p));
    } else {
      setPredictions([...predictions, { ...form, id: Date.now(), category: activeTab, sent: false }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this prediction?")) setPredictions(predictions.filter((p) => p.id !== id));
  };

  const handleSend = (id: number) => {
    setPredictions(predictions.map((p) => p.id === id ? { ...p, sent: true } : p));
    alert("✅ Prediction sent to all active subscribers!");
  };

  return (
    <AdminLayout title="Value Bets Management">
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={activeTab === t.key ? "btn-primary" : "btn-secondary"}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-title">{TABS.find((t) => t.key === activeTab)?.label} Predictions</span>
          <button className="btn-primary" onClick={openAdd}>+ Add Prediction</button>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "#475569" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>📋</div>
            <p>No predictions yet. Click <strong>+ Add Prediction</strong> to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>League</th><th>Fixture</th><th>Pick</th><th>Odds</th><th>Confidence</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: "#64748b" }}>{p.matchNum}</td>
                    <td><span className="badge badge-gray">{p.league}</span></td>
                    <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{p.fixture}</td>
                    <td style={{ color: "#10b981", fontWeight: 700 }}>{p.pick}</td>
                    <td style={{ color: "#f59e0b", fontWeight: 700 }}>{p.odds}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, background: "#1e293b", borderRadius: 20, height: 6, minWidth: 60 }}>
                          <div style={{ width: `${p.confidence}%`, height: "100%", background: "#10b981", borderRadius: 20 }} />
                        </div>
                        <span style={{ color: "#10b981", fontSize: "0.78rem", fontWeight: 700 }}>{p.confidence}%</span>
                      </div>
                    </td>
                    <td>{p.sent ? <span className="badge badge-green">✓ Sent</span> : <span className="badge badge-red">Pending</span>}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {!p.sent && (
                          <button className="btn-primary" style={{ padding: "5px 10px", fontSize: "0.75rem" }} onClick={() => handleSend(p.id)}>📤 Send</button>
                        )}
                        <button className="btn-icon" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn-danger" onClick={() => handleDelete(p.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editId ? "Edit Prediction" : `Add ${TABS.find((t) => t.key === activeTab)?.label} Prediction`}</span>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Match #</label>
                  <input className="form-input" type="number" name="matchNum" min={1} value={form.matchNum} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">League</label>
                  <input className="form-input" name="league" placeholder="e.g. EPL, UCL" value={form.league} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confidence %</label>
                  <input className="form-input" type="number" name="confidence" min={1} max={100} value={form.confidence} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Fixture</label>
                  <input className="form-input" name="fixture" placeholder="e.g. Arsenal vs Chelsea" value={form.fixture} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pick</label>
                  <input className="form-input" name="pick" placeholder="e.g. 1, X, 2, Over 2.5, 2-1" value={form.pick} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Odds</label>
                  <input className="form-input" name="odds" placeholder="e.g. 1.85" value={form.odds} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Analysis</label>
                  <textarea className="form-textarea" name="analysis" placeholder="Statistical analysis for subscribers..." value={form.analysis} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{editId ? "Save Changes" : "Add Prediction"}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ValueBetsAdmin;
