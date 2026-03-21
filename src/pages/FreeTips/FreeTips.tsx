import { useState } from "react";
import "./FreeTips.css";

type Day = "yesterday" | "today" | "tomorrow";

interface FreeTip {
  time: string;
  league: string;
  fixture: string;
  tip: string;
  status?: "won" | "lost" | "pending";
}

const TIPS: Record<Day, FreeTip[]> = {
  yesterday: [
    { time: "15:00", league: "EPL", fixture: "Man Utd vs Everton", tip: "Home Win", status: "won" },
    { time: "17:30", league: "La Liga", fixture: "Barcelona vs Sevilla", tip: "BTTS", status: "won" },
    { time: "20:00", league: "Serie A", fixture: "Juventus vs Lazio", tip: "Over 2.5", status: "lost" },
  ],
  today: [
    { time: "14:00", league: "EPL", fixture: "Man City vs Wolves", tip: "Over 2.5", status: "pending" },
    { time: "16:30", league: "Bundesliga", fixture: "Bayern vs Dortmund", tip: "Home Win", status: "pending" },
    { time: "19:45", league: "UCL", fixture: "Real Madrid vs City", tip: "BTTS", status: "pending" },
    { time: "21:00", league: "KPL", fixture: "Gor Mahia vs AFC", tip: "Over 1.5", status: "pending" },
  ],
  tomorrow: [
    { time: "13:30", league: "EPL", fixture: "Arsenal vs Tottenham", tip: "Home Win" },
    { time: "16:00", league: "La Liga", fixture: "Real Madrid vs Valencia", tip: "Over 2.5" },
    { time: "19:30", league: "Serie A", fixture: "Inter vs Roma", tip: "BTTS" },
  ],
};

const STATUS_MAP = {
  won: { label: "✓ Won", class: "status-won" },
  lost: { label: "✗ Lost", class: "status-lost" },
  pending: { label: "⏳ Pending", class: "status-pending" },
};

const FreeTips = () => {
  const [activeDay, setActiveDay] = useState<Day>("today");
  const tips = TIPS[activeDay];
  const wonCount = TIPS.yesterday.filter((t) => t.status === "won").length;
  const totalYesterday = TIPS.yesterday.length;

  return (
    <div className="free-tips-page">
      <div className="ft-inner">
        <div className="ft-header">
          <p className="ft-eyebrow">100% Free</p>
          <h1>Daily Football Tips</h1>
          <p className="ft-sub">Expert picks updated every day. No subscription needed.</p>
        </div>

        <div className="stats-row">
          <div className="stat-chip"><span className="stat-num">{wonCount}/{totalYesterday}</span><span className="stat-label">Yesterday's wins</span></div>
          <div className="stat-chip"><span className="stat-num">90%+</span><span className="stat-label">Accuracy rate</span></div>
          <div className="stat-chip"><span className="stat-num">Daily</span><span className="stat-label">Tips updated</span></div>
        </div>

        <div className="day-tabs">
          {(["yesterday", "today", "tomorrow"] as Day[]).map((d) => (
            <button key={d} className={`day-tab ${activeDay === d ? "active" : ""}`} onClick={() => setActiveDay(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <div className="ft-table-wrapper">
          <table className="ft-table">
            <thead>
              <tr>
                <th>Time</th><th>League</th><th>Fixture</th><th>Prediction</th>
                {(activeDay === "yesterday" || activeDay === "today") && <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {tips.map((tip, i) => (
                <tr key={i}>
                  <td className="td-time">{tip.time}</td>
                  <td><span className="league-pill">{tip.league}</span></td>
                  <td className="td-fixture">{tip.fixture}</td>
                  <td className="td-tip">{tip.tip}</td>
                  {tip.status && (
                    <td><span className={`status-pill ${STATUS_MAP[tip.status].class}`}>{STATUS_MAP[tip.status].label}</span></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ft-cards">
          {tips.map((tip, i) => (
            <div className="ft-tip-card" key={i}>
              <div className="ftc-top">
                <span className="league-pill">{tip.league}</span>
                <span className="ftc-time">{tip.time}</span>
              </div>
              <h3 className="ftc-fixture">{tip.fixture}</h3>
              <div className="ftc-bottom">
                <span className="ftc-tip">🎯 {tip.tip}</span>
                {tip.status && <span className={`status-pill ${STATUS_MAP[tip.status].class}`}>{STATUS_MAP[tip.status].label}</span>}
              </div>
            </div>
          ))}
        </div>

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
