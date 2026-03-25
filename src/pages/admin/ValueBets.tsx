import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/api";

type VBCategory = "SPORTPESA" | "BETIKA" | "CORRECT_SCORE" | "GOAL_RANGE";

interface VBPrediction {
  id: string;
  matchNumber: number;
  league: string;
  gameDate: string;
  fixture: string;
  pick: string;
  odds: string;
  confidence: number;
  analysis: string;
  category: VBCategory;
  sent: boolean;
}

const TABS: { key: VBCategory; label: string }[] = [
  { key: "SPORTPESA",     label: "SportPesa"    },
  { key: "BETIKA",        label: "Betika"        },
  { key: "CORRECT_SCORE", label: "Correct Score" },
  { key: "GOAL_RANGE",    label: "Goal Range"    },
];

const EMPTY_FORM = {
  matchNumber: 1, league: "", gameDate: new Date().toISOString().slice(0, 10),
  fixture: "", pick: "", odds: "", confidence: 75, analysis: "",
};

const ValueBetsAdmin = () => {
  const [predictions, setPredictions] = useState<VBPrediction[]>([]);
  const [activeTab, setActiveTab] = useState<VBCategory>("SPORTPESA");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPredictions = () => {
    setLoading(true);
    // Pass both category and date to the API
    adminApi.getValueBets(activeTab.toLowerCase().replace("_", "-"), filterDate)
      .then((res) => setPredictions(res.data))
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPredictions(); }, [activeTab, filterDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.name === "matchNumber" || e.target.name === "confidence"
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, gameDate: filterDate });
    setEditId(null);
    setShowModal(true);
  };
  const openEdit = (p: VBPrediction) => {
    setForm({
      matchNumber: p.matchNumber, league: p.league, gameDate: p.gameDate,
      fixture: p.fixture, pick: p.pick, odds: p.odds || "",
      confidence: p.confidence, analysis: p.analysis || "",
    });
    setEditId(p.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.fixture || !form.pick) return;
    setSaving(true);
    try {
      const payload = { ...form, category: activeTab };
      if (editId) {
        await adminApi.updateValueBet(editId, payload);
      } else {
        await adminApi.createValueBet(payload);
      }
      fetchPredictions();
      setShowModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prediction?")) return;
    await adminApi.deleteValueBet(id);
    fetchPredictions();
  };

  const isToday = filterDate === new Date().toISOString().slice(0, 10);

  return (
    <AdminLayout title="Value Bets Management">
      {/* ── Category tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={activeTab === t.key ? "btn-primary" : "btn-secondary"}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-title">
            {TABS.find((t) => t.key === activeTab)?.label} — {isToday ? "Today" : new Date(filterDate + "T00:00:00").toLocaleDateString("en-KE", { dateStyle: "long" })}
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {/* ── Date picker ── */}
            <input
              className="form-input"
              type="date"
              style={{ width: "auto" }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              title="Pick a date"
            />
            {!isToday && (
              <button
                className="btn-secondary"
                style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                onClick={() => setFilterDate(new Date().toISOString().slice(0, 10))}
              >
                Today
              </button>
            )}
            <button className="btn-primary" onClick={openAdd}>+ Add Prediction</button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading...</div>
        ) : predictions.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "#475569" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>📋</div>
            <p>No predictions for this date. Click <strong>+ Add Prediction</strong> to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr><th>#</th><th>League</th><th>Fixture</th><th>Pick</th><th>Odds</th><th>Confidence</th><th>Sent</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: "#64748b" }}>{p.matchNumber}</td>
                    <td><span className="badge badge-gray">{p.league}</span></td>
                    <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{p.fixture}</td>
                    <td style={{ color: "#10b981", fontWeight: 700 }}>{p.pick}</td>
                    <td style={{ color: "#f59e0b", fontWeight: 700 }}>{p.odds || "-"}</td>
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
              <span className="modal-title">{editId ? "Edit Prediction" : `Add ${TABS.find((t) => t.key === activeTab)?.label}`}</span>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Match #</label>
                  <input className="form-input" type="number" name="matchNumber" min={1} value={form.matchNumber} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" name="gameDate" value={form.gameDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">League</label>
                  <input className="form-input" name="league" placeholder="EPL, UCL..." value={form.league} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confidence %</label>
                  <input className="form-input" type="number" name="confidence" min={1} max={100} value={form.confidence} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Fixture</label>
                  <input className="form-input" name="fixture" placeholder="Arsenal vs Chelsea" value={form.fixture} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pick</label>
                  <input className="form-input" name="pick" placeholder="1, X, 2, Over 2.5..." value={form.pick} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Odds</label>
                  <input className="form-input" name="odds" placeholder="1.85" value={form.odds} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Analysis</label>
                  <textarea className="form-textarea" name="analysis" placeholder="Statistical analysis..." value={form.analysis} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Prediction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ValueBetsAdmin;