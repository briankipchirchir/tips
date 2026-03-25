import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/api";

type TipLevel = "FREE" | "SILVER" | "GOLD" | "PLATINUM";

interface Tip {
  id: string;
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

// ── Single-tip form default ──
const EMPTY_SINGLE = {
  league: "", fixture: "", kickoffTime: "",
  gameDate: new Date().toISOString().slice(0, 10),
  prediction: "", odds: "", level: "SILVER" as TipLevel, analysis: "",
};

// ── One row in the bulk table ──
type BulkRow = typeof EMPTY_SINGLE;
const emptyRow = (): BulkRow => ({ ...EMPTY_SINGLE });

// ── Inline editable cell ──
const Cell = ({
  type = "text", value, onChange, placeholder, options,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
}) => {
  const base: React.CSSProperties = {
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 4,
    color: "#f1f5f9",
    fontSize: "0.82rem",
    padding: "4px 6px",
    width: "100%",
    outline: "none",
  };
  if (options) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...base, background: "#0f172a", cursor: "pointer" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={base}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#334155")}
      onBlur={(e)  => (e.currentTarget.style.borderColor = "transparent")}
    />
  );
};

const TipsManagement = () => {
  const [tips, setTips]             = useState<Tip[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));

  // ── Single modal ──
  const [showSingle, setShowSingle] = useState(false);
  const [singleForm, setSingleForm] = useState({ ...EMPTY_SINGLE });
  const [editId, setEditId]         = useState<string | null>(null);
  const [savingSingle, setSavingSingle] = useState(false);

  // ── Bulk modal ──
  const [showBulk, setShowBulk]     = useState(false);
  const [bulkRows, setBulkRows]     = useState<BulkRow[]>([emptyRow(), emptyRow()]);
  const [savingBulk, setSavingBulk] = useState(false);
  const [bulkError, setBulkError]   = useState("");

  const fetchTips = () => {
    setLoading(true);
    adminApi.getTips(filterDate)
      .then((res) => setTips(res.data))
      .catch(() => setTips([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTips(); }, [filterDate]);

  const filtered = filterLevel === "ALL" ? tips : tips.filter((t) => t.level === filterLevel);
  const isToday  = filterDate === new Date().toISOString().slice(0, 10);

  // ── Single handlers ──
  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSingleForm({ ...singleForm, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setSingleForm({ ...EMPTY_SINGLE, gameDate: filterDate });
    setEditId(null);
    setShowSingle(true);
  };

  const openEdit = (tip: Tip) => {
    setSingleForm({
      league: tip.league, fixture: tip.fixture, kickoffTime: tip.kickoffTime,
      gameDate: tip.gameDate, prediction: tip.prediction, odds: tip.odds || "",
      level: tip.level, analysis: tip.analysis || "",
    });
    setEditId(tip.id);
    setShowSingle(true);
  };

  const handleSaveSingle = async () => {
    if (!singleForm.fixture || !singleForm.prediction) return;
    setSavingSingle(true);
    try {
      if (editId) {
        await adminApi.updateTip(editId, singleForm);
      } else {
        await adminApi.createTip(singleForm);
      }
      fetchTips();
      setShowSingle(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSingle(false);
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

  // ── Bulk handlers ──
  const updateRow = (i: number, field: keyof BulkRow, value: string) => {
    setBulkRows((rows) => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const addRow = () => setBulkRows((rows) => [...rows, { ...emptyRow(), gameDate: filterDate }]);

  const removeRow = (i: number) => {
    if (bulkRows.length === 1) return;
    setBulkRows((rows) => rows.filter((_, idx) => idx !== i));
  };

  const openBulk = () => {
    setBulkRows([
      { ...emptyRow(), gameDate: filterDate },
      { ...emptyRow(), gameDate: filterDate },
    ]);
    setBulkError("");
    setShowBulk(true);
  };

  const handleSaveBulk = async () => {
    const invalid = bulkRows.findIndex((r) => !r.fixture.trim() || !r.prediction.trim());
    if (invalid !== -1) {
      setBulkError(`Row ${invalid + 1}: Fixture and Prediction are required.`);
      return;
    }
    setBulkError("");
    setSavingBulk(true);
    try {
      // Backend expects: { tips: [ { league, fixture, kickoffTime, gameDate, prediction, odds, analysis, level } ] }
      await adminApi.createBulkTips({ tips: bulkRows });
      fetchTips();
      setShowBulk(false);
    } catch (e) {
      console.error(e);
      setBulkError("Failed to save. Please try again.");
    } finally {
      setSavingBulk(false);
    }
  };

  const LEVEL_OPTIONS = [
    { value: "FREE",     label: "Free"     },
    { value: "SILVER",   label: "Silver"   },
    { value: "GOLD",     label: "Gold"     },
    { value: "PLATINUM", label: "Platinum" },
  ];

  return (
    <AdminLayout title="Tips Management">
      <div className="admin-section">
        <div className="admin-section-header">
          <span className="admin-section-title">
            {isToday
              ? "Today's Tips"
              : `Tips — ${new Date(filterDate + "T00:00:00").toLocaleDateString("en-KE", { dateStyle: "long" })}`}
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input
              className="form-input" type="date" style={{ width: "auto" }}
              value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
            />
            {!isToday && (
              <button className="btn-secondary" style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                onClick={() => setFilterDate(new Date().toISOString().slice(0, 10))}>
                Today
              </button>
            )}
            <select className="form-select" style={{ width: "auto", padding: "7px 12px" }}
              value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="ALL">All Levels</option>
              <option value="FREE">Free</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
            </select>
            {/* ── Two add buttons ── */}
            <button className="btn-secondary" onClick={openBulk}>⚡ Bulk Add</button>
            <button className="btn-primary"   onClick={openAdd}>+ Add Tip</button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Time</th><th>League</th><th>Fixture</th><th>Tip</th><th>Odds</th><th>Package</th><th>Sent</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "#64748b" }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "#64748b" }}>No tips for this date.</td></tr>
              ) : filtered.map((tip) => (
                <tr key={tip.id}>
                  <td style={{ color: "#64748b" }}>{tip.kickoffTime}</td>
                  <td><span className="badge badge-gray">{tip.league}</span></td>
                  <td style={{ color: "#f1f5f9", fontWeight: 600 }}>{tip.fixture}</td>
                  <td style={{ color: "#10b981", fontWeight: 700 }}>{tip.prediction}</td>
                  <td style={{ color: "#f59e0b", fontWeight: 700 }}>{tip.odds || "-"}</td>
                  <td><span className={`badge ${LEVEL_BADGE[tip.level]}`}>{tip.level}</span></td>
                  <td>{tip.sent
                    ? <span className="badge badge-green">✓ Sent</span>
                    : <span className="badge badge-red">Pending</span>}
                  </td>
                  <td>
                    <select value={tip.status} onChange={(e) => handleStatusUpdate(tip.id, e.target.value)}
                      style={{
                        background: tip.status === "WON" ? "#064e3b" : tip.status === "LOST" ? "#7f1d1d" : "#1e293b",
                        color:      tip.status === "WON" ? "#10b981" : tip.status === "LOST" ? "#ef4444" : "#94a3b8",
                        border: "none", borderRadius: "6px", padding: "4px 8px", fontWeight: 600, cursor: "pointer",
                      }}>
                      <option value="PENDING">⏳ Pending</option>
                      <option value="WON">✅ Won</option>
                      <option value="LOST">❌ Lost</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-icon"   onClick={() => openEdit(tip)}>✏️</button>
                      <button className="btn-danger" onClick={() => handleDelete(tip.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════ SINGLE MODAL ═══════════════════════════ */}
      {showSingle && (
        <div className="modal-overlay" onClick={() => setShowSingle(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editId ? "Edit Tip" : "Add New Tip"}</span>
              <button className="btn-icon" onClick={() => setShowSingle(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" name="gameDate" value={singleForm.gameDate} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kick-off Time</label>
                  <input className="form-input" type="time" name="kickoffTime" value={singleForm.kickoffTime} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">League</label>
                  <input className="form-input" name="league" placeholder="EPL, UCL, KPL..." value={singleForm.league} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Package</label>
                  <select className="form-select" name="level" value={singleForm.level} onChange={handleSingleChange}>
                    {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="form-group full">
                  <label className="form-label">Fixture</label>
                  <input className="form-input" name="fixture" placeholder="Arsenal vs Chelsea" value={singleForm.fixture} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Prediction</label>
                  <input className="form-input" name="prediction" placeholder="Over 2.5, BTTS..." value={singleForm.prediction} onChange={handleSingleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Odds</label>
                  <input className="form-input" name="odds" placeholder="1.85" value={singleForm.odds} onChange={handleSingleChange} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Analysis</label>
                  <textarea className="form-textarea" name="analysis" placeholder="Brief analysis..." value={singleForm.analysis} onChange={handleSingleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSingle(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveSingle} disabled={savingSingle}>
                {savingSingle ? "Saving..." : editId ? "Save Changes" : "Add Tip"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ BULK MODAL ═══════════════════════════ */}
      {showBulk && (
        <div className="modal-overlay" onClick={() => setShowBulk(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 1100, width: "96vw" }}
          >
            <div className="modal-header">
              <span className="modal-title">⚡ Bulk Add Tips</span>
              <button className="btn-icon" onClick={() => setShowBulk(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ padding: 0 }}>
              {/* ── tip count + helper text ── */}
              <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                  {bulkRows.length} tip{bulkRows.length !== 1 ? "s" : ""} — fill each row then click Save All
                </span>
                <button className="btn-secondary" style={{ fontSize: "0.8rem", padding: "5px 12px" }} onClick={addRow}>
                  + Add Row
                </button>
              </div>

              {/* ── scrollable table ── */}
              <div style={{ overflowX: "auto", maxHeight: "55vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead style={{ position: "sticky", top: 0, background: "#0f172a", zIndex: 1 }}>
                    <tr style={{ borderBottom: "1px solid #1e293b" }}>
                      {["#", "Date", "Time", "League", "Fixture *", "Prediction *", "Odds", "Package", "Analysis", ""].map((h) => (
                        <th key={h} style={{ padding: "8px 10px", color: "#64748b", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "6px 10px", color: "#475569", width: 30 }}>{i + 1}</td>
                        <td style={{ padding: "6px 6px", minWidth: 130 }}>
                          <Cell type="date" value={row.gameDate} onChange={(v) => updateRow(i, "gameDate", v)} />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 90 }}>
                          <Cell type="time" value={row.kickoffTime} onChange={(v) => updateRow(i, "kickoffTime", v)} />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 80 }}>
                          <Cell value={row.league} onChange={(v) => updateRow(i, "league", v)} placeholder="EPL" />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 160 }}>
                          <Cell value={row.fixture} onChange={(v) => updateRow(i, "fixture", v)} placeholder="Arsenal vs Chelsea" />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 120 }}>
                          <Cell value={row.prediction} onChange={(v) => updateRow(i, "prediction", v)} placeholder="Over 2.5" />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 70 }}>
                          <Cell value={row.odds} onChange={(v) => updateRow(i, "odds", v)} placeholder="1.85" />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 100 }}>
                          <Cell value={row.level} onChange={(v) => updateRow(i, "level", v)} options={LEVEL_OPTIONS} />
                        </td>
                        <td style={{ padding: "6px 6px", minWidth: 150 }}>
                          <Cell value={row.analysis} onChange={(v) => updateRow(i, "analysis", v)} placeholder="Optional..." />
                        </td>
                        <td style={{ padding: "6px 10px", width: 32 }}>
                          <button
                            onClick={() => removeRow(i)}
                            title="Remove row"
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1rem", lineHeight: 1 }}
                          >
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
              <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
                * Required fields
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-secondary" onClick={() => setShowBulk(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSaveBulk} disabled={savingBulk}>
                  {savingBulk ? "Saving..." : `Save All ${bulkRows.length} Tips`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TipsManagement;