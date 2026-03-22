import { useState, useEffect } from "react";
import { tipsApi } from "../../services/api";
import "./FreeTips.css";

type Day = "yesterday" | "today" | "tomorrow";

interface Tip {
  id: string;
  league: string;
  fixture: string;
  prediction: string;
  odds: string;
  kickoffTime: string;
}

const getDate = (day: Day): string => {
  const d = new Date();
  if (day === "yesterday") d.setDate(d.getDate() - 1);
  if (day === "tomorrow")  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const FreeTips = () => {
  const [activeDay, setActiveDay] = useState<Day>("today");
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    tipsApi.getFreeTips(getDate(activeDay))
      .then((res) => setTips(res.data))
      .catch(() => setTips([]))
      .finally(() => setLoading(false));
  }, [activeDay]);

  return (
    <div className="free-tips-page">
      <div className="ft-inner">
        <div className="ft-header">
          <p className="ft-eyebrow">100% Free</p>
          <h1>Daily Football Tips</h1>
          <p className="ft-sub">Expert picks updated every day. No subscription needed.</p>
        </div>

        <div className="stats-row">
          <div className="stat-chip"><span className="stat-num">{tips.length}</span><span className="stat-label">Tips today</span></div>
          <div className="stat-chip"><span className="stat-num">90%+</span><span className="stat-label">Accuracy rate</span></div>
          <div className="stat-chip"><span className="stat-num">Daily</span><span className="stat-label">Tips updated</span></div>
        </div>

        <div className="day-tabs">
          {(["yesterday", "today", "tomorrow"] as Day[]).map((d) => (
            <button key={d} className={`day-tab ${activeDay === d ? "active" : ""}`}
              onClick={() => setActiveDay(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading tips...</div>
        ) : tips.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            <p style={{ fontSize: "2rem" }}>⚽</p>
            <p>No tips available for this day yet. Check back later!</p>
          </div>
        ) : (
          <>
            <div className="ft-table-wrapper">
              <table className="ft-table">
                <thead>
                  <tr><th>Time</th><th>League</th><th>Fixture</th><th>Prediction</th><th>Odds</th></tr>
                </thead>
                <tbody>
                  {tips.map((tip) => (
                    <tr key={tip.id}>
                      <td className="td-time">{tip.kickoffTime}</td>
                      <td><span className="league-pill">{tip.league}</span></td>
                      <td className="td-fixture">{tip.fixture}</td>
                      <td className="td-tip">{tip.prediction}</td>
                      <td style={{ color: "#f59e0b", fontWeight: 700 }}>{tip.odds || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ft-cards">
              {tips.map((tip) => (
                <div className="ft-tip-card" key={tip.id}>
                  <div className="ftc-top">
                    <span className="league-pill">{tip.league}</span>
                    <span className="ftc-time">{tip.kickoffTime}</span>
                  </div>
                  <h3 className="ftc-fixture">{tip.fixture}</h3>
                  <div className="ftc-bottom">
                    <span className="ftc-tip">🎯 {tip.prediction}</span>
                    {tip.odds && <span style={{ color: "#f59e0b", fontWeight: 700 }}>@ {tip.odds}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="upgrade-cta">
          <div className="cta-content">
            <h3>Want higher odds & more tips?</h3>
            <p>Upgrade to Premium — starts from KSH 50/day</p>
          </div>
          <a href="/subscribe" className="cta-btn">View Premium Plans →</a>
        </div>
      </div>
    </div>
  );
};

export default FreeTips;
