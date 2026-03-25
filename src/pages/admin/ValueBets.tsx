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

const EMPTY_SINGLE = {
  matchNumber: 1, league: "", gameDate: new Date().toISOString().slice(0, 10),
  fixture: "", pick: "", odds: "", confidence: 75, analysis: "",
};

// ── Bulk row type ──
type BulkRow = {
  matchNumber: number;
  league: string;
  gameDate: string;
  fixture: string;
  pick: string;
  odds: string;
  confidence: number;
  analysis: string;
};

const emptyBulkRow = (date: string, matchNumber: number): BulkRow => ({
  matchNumber, league: "", gameDate: date,
  fixture: "", pick: "", odds: "", confidence: 75, analysis: "",
});

// ── Inline editable cell ──
const Cell = ({
  type = "text", value, onChange, placeholder, isNumber,
}: {
  type?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  isNumber?: boolean;
}) => (
  <input
    type={isNumber ? "number" : type}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    style={{
      background: "transparent",
      border: "1px solid transparent",
      borderRadius: 4,
      color: "#f1f5f9",
      fontSize: "0.82rem",
      padding: "4px 6px",
      width: "100%",
      outline: "none",
    }}
    onFocus={(e) => (e.currentTarget.style.borderColor = "#334155")}
    onBlur={(e)  => (e.currentTarget.style.borderColor = "transparent")}
  />
);

const ValueBetsAdmin = () => {
  const [predictions, setPredictions] = useState<VBPrediction[]>([]);
  const [activeTab, setActiveTab]     = useState<VBCategory>("SPORTPESA");
  const [filterDate, setFilterDate]   = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading]         = useState(true);

  // ── Single modal ──
  const [showSingle, setShowSingle]   = useState(false);
  const [singleForm, setSingleForm]   = useState({ ...EMPTY_SINGLE });
  const [editId, setEditId]           = useState<string | null>(null);
  const [savingSingle, setSavingSingle] = useState(false);

  // ── Bulk modal ──
  const [showBulk, setShowBulk]       = useState(false);
  const [bulkRows, setBulkRows]       = useState<BulkRow[]>([]);
  const [savingBulk, setSavingBulk]   = useState(false);
  const [bulkError, setBulkError]     = useState("");

  const fetchPredictions = () => {
    setLoading(true);
    adminApi.getValueBets(activeTab.toLowerCase().replace("_", "-"), filterDate)
      .then((res) => setPredictions(res.data))
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPredictions(); }, [activeTab, filterDate]);

  const isToday = filterDate === new Date().toISOString().slice(0, 10);

  // ── Single handlers ──
  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSingleForm({
      ...singleForm,
      [e.target.name]: e.target.name === "matchNumber" || e.target.name === "confidence"
        ? Number(e.target.value) : e.target.value,
    });
  };

  const openAdd = () => {
    setSingleForm({ ...EMPTY_SINGLE, gameDate: filterDate });
    setEditId(null);
    setShowSingle(true);
  };

  const openEdit = (p: VBPrediction) => {
    setSingleForm({
      matchNumber: p.matchNumber, league: p.league, gameDate: p.gameDate,
      fixture: p.fixture, pick: p.pick, odds: p.odds || "",
      confidence: p.confidence, analysis: p.analysis || "",
    });
    setEditId(p.id);
    setShowSingle(true);
  };

  const handleSaveSingle = async () => {
    if (!singleForm.fixture || !singleForm.pick) return;
    setSavingSingle(true);
    try {
      const payload = { ...singleForm, category: activeTab };
      if (editId) {
        await adminApi.updateValueBet(editId, payload);
      } else {
        await adminApi.createValueBet(payload);
      }
      fetchPredictions();
      setShowSingle(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSingle(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prediction?")) return;
    await adminApi.deleteValueBet(id);
    fetchPredictions();
  };

  // ── Bulk handlers ──
  const openBulk = () => {
    setBulkRows([
      emptyBulkRow(filterDate, 1),
      emptyBulkRow(filterDate, 2),
    ]);
    setBulkError("");
    setShowBulk(true);
  };

  const updateBulkRow = (i: number, field: keyof BulkRow, raw: string) => {
    setBulkRows((rows) =>
      rows.map((r, idx) =>
        idx === i
          ? { ...r, [field]: field === "matchNumber" || field === "confidence" ? Number(raw) : raw }
          : r
      )
    );
  };

  const addBulkRow = () =>
    setBulkRows((rows) => [...rows, emptyBulkRow(filterDate, rows.length + 1)]);

  const removeBulkRow = (i: number) => {
    if (bulkRows.length === 1) return;
    setBulkRows((rows) => rows.filter((_, idx) => idx !== i));
  };

  const handleSaveBulk = async () => {
    const invalid = bulkRows.findIndex((r) => !r.fixture.trim() || !r.pick.trim());
    if (invalid !== -1) {
      setBulkError(`Row ${invalid + 1}: Fixture and Pick are required.`);
      return;
    }
    setBulkError("");
    setSavingBulk(true);
    try {
      // Backend expects List<AdminValueBetRequestDto> directly
      const payload = bulkRows.map((r) => ({ ...r, category: activeTab }));
      await adminApi.createBulkValueBets(payload);
      fetchPredictions();
      setShowBulk(false);
    } catch (e) {
      console.error(e);
      setBulkError("Failed to save. Please try again.");
    } finally {
      setSavingBulk(false);
    }
  };

  return (
    <AdminLayout title="Value Bets Management">
      {/* ── Category tabs ── */}
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
          <span className="admin-section-title">
            {TABS.find((t) => t.key === activeTab)?.label} —{" "}
            {isToday ? "Today" : new Date(filterDate + "T00:00:00").toLocaleDateString("en-KE", { dateStyle: "long" })}
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input className="form-input" type="date" style={{ width: "auto" }}
              value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
            {!isToday && (
              <button className="btn-secondary" style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                onClick={() => setFilterDate(new Date().toISOString().slice(0, 10))}>
                Today
              </button>
            )}
            <button className="btn-secondary" onClick={openBulk}>⚡ Bulk Add</button>
            <button className="btn-primary"   onClick={openAdd}>+ Add Prediction</button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading...</div>
        ) : predictions.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "#475569" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>📋</div>
            <p>No predictions for this date. Click <strong>+ Add Prediction</strong> or <strong>⚡ Bulk Add</strong>.</p>
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
                    <td>{p.sent
                      ? <span className="badge badge-green">✓ Sent</span>
                      : <span className="badge badge-red">Pending</span>}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn-icon"   onClick={() => openEdit(p)}>✏️</button>
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

      {/* ═══════════════════════════ SINGLE MODAL ═══════════════════════════ */}
      {showSingle && (
        <div className="modal-overlay" onClick={() => setShowSingle(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editId ? "Edit Prediction" : `Add ${TABS.find((t) => t.key === activeTab)?.label}`}</span>
              <button className="btn-icon" onClick={() => setShowSingle(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Match #</label>
                  <input className="form-input" type="number" name="matchNumber" min={1} value={singleForm.matchNumber} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" name="gameDate" value={singleForm.gameDate} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">League</label>
                  <input className="form-input" name="league" placeholder="EPL, UCL..." value={singleForm.league} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confidence %</label>
                  <input className="form-input" type="number" name="confidence" min={1} max={100} value={singleForm.confidence} onChange={handleSingleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Fixture</label>
                  <input className="form-input" name="fixture" placeholder="Arsenal vs Chelsea" value={singleForm.fixture} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pick</label>
                  <input className="form-input" name="pick" placeholder="1, X, 2, Over 2.5..." value={singleForm.pick} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Odds</label>
                  <input className="form-input" name="odds" placeholder="1.85" value={singleForm.odds} onChange={handleSingleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Analysis</label>
                  <textarea className="form-textarea" name="analysis" placeholder="Statistical analysis..." value={singleForm.analysis} onChange={handleSingleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSingle(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveSingle} disabled={savingSingle}>
                {savingSingle ? "Saving..." : editId ? "Save Changes" : "Add Prediction"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ BULK MODAL ═══════════════════════════ */}
      {showBulk && (
        <div className="modal-overlay" onClick={() => setShowBulk(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 1050, width: "96vw" }}>
            <div className="modal-header">
              <span className="modal-title">
                ⚡ Bulk Add — {TABS.find((t) => t.key === activeTab)?.label}
              </span>
              <button className="btn-icon" onClick={() => setShowBulk(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ padding: 0 }}>
              <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                  {bulkRows.length} prediction{bulkRows.length !== 1 ? "s" : ""} — fill each row then click Save All
                </span>
                <button className="btn-secondary" style={{ fontSize: "0.8rem", padding: "5px 12px" }} onClick={addBulkRow}>
                  + Add Row
                </button>
              </div>

              <div style={{ overflowX: "auto", maxHeight: "55vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead style={{ position: "sticky", top: 0, background: "#0f172a", zIndex: 1 }}>
                    <tr style={{ borderBottom: "1px solid #1e293b" }}>
                      {["#", "Match #", "Date", "League", "Fixture *", "Pick *", "Odds", "Conf %", "Analysis", ""].map((h) => (
                        <th key={h} style={{ padding: "8px 10px", color: "#64748b", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "6px 10px", color: "#475569", width: 28 }}>{i + 1}</td>
                        <td style={{ padding: "6px 6px", width: 60 }}>
                          <Cell isNumber value={row.matchNumber} onChange={(v) => updateBulkRow(i, "matchNumber", v)} />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 130 }}>
                          <Cell type="date" value={row.gameDate} onChange={(v) => updateBulkRow(i, "gameDate", v)} />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 80 }}>
                          <Cell value={row.league} onChange={(v) => updateBulkRow(i, "league", v)} placeholder="EPL" />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 160 }}>
                          <Cell value={row.fixture} onChange={(v) => updateBulkRow(i, "fixture", v)} placeholder="Arsenal vs Chelsea" />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 110 }}>
                          <Cell value={row.pick} onChange={(v) => updateBulkRow(i, "pick", v)} placeholder="1 / X / Over 2.5" />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 70 }}>
                          <Cell value={row.odds} onChange={(v) => updateBulkRow(i, "odds", v)} placeholder="1.85" />
                        </td>
                        <td style={{ padding: "6px 6px", width: 70 }}>
                          <Cell isNumber value={row.confidence} onChange={(v) => updateBulkRow(i, "confidence", v)} placeholder="75" />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 140 }}>
                          <Cell value={row.analysis} onChange={(v) => updateBulkRow(i, "analysis", v)} placeholder="Optional..." />
                        </td>
                        <td style={{ padding: "6px 10px", width: 32 }}>
                          <button onClick={() => removeBulkRow(i)} title="Remove row"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1rem", lineHeight: 1 }}>
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {bulkError && (
                <div style={{ padding: "10px 20px", color: "#ef4444", fontSize: "0.82rem", borderTop: "1px solid #1e293b" }}>
                  ⚠ {bulkError}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <span style={{ color: "#64748b", fontSize: "0.78rem" }}>* Required fields</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-secondary" onClick={() => setShowBulk(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSaveBulk} disabled={savingBulk}>
                  {savingBulk ? "Saving..." : `Save All ${bulkRows.length} Predictions`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ValueBetsAdmin;