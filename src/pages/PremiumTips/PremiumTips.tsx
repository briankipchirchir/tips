import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./PremiumTips.css";

type PlanLevel = "FREE" | "SILVER" | "GOLD" | "PLATINUM" | "NONE";

interface Tip {
  id: number; time: string; league: string; fixture: string;
  tip: string; odds: string; level: "SILVER" | "GOLD" | "PLATINUM"; analysis: string;
}

const TIPS: Tip[] = [
  { id: 1, time: "14:00", league: "EPL", fixture: "Arsenal vs Chelsea", tip: "Over 2.5 Goals", odds: "1.85", level: "SILVER", analysis: "Both teams average 2.8 goals per game this season. Chelsea have conceded in 8 of last 10 away games." },
  { id: 2, time: "16:30", league: "La Liga", fixture: "Barcelona vs Atletico", tip: "BTTS", odds: "1.72", level: "SILVER", analysis: "Both teams scored in 7 of their last 8 league meetings. Atletico have netted in all 5 away games." },
  { id: 3, time: "18:45", league: "EPL", fixture: "Man City vs Liverpool", tip: "Home Win", odds: "2.10", level: "GOLD", analysis: "City unbeaten in last 11 home games. Liverpool missing 2 key defenders. City's pressing stats dominate." },
  { id: 4, time: "20:00", league: "Serie A", fixture: "Inter vs Napoli", tip: "Over 1.5 Goals", odds: "1.55", level: "GOLD", analysis: "Inter scored in first half in 9 of 10 matches. Napoli attack averaging 2.1 goals per away game." },
  { id: 5, time: "21:00", league: "UCL", fixture: "PSG vs Bayern", tip: "Both Teams to Score & Over 2.5", odds: "1.95", level: "PLATINUM", analysis: "Champion's League thriller expected. Combined 6.2 avg goals in their last 3 UCL encounters." },
  { id: 6, time: "21:00", league: "Bundesliga", fixture: "Dortmund vs Leipzig", tip: "Correct Score 2-1", odds: "8.50", level: "PLATINUM", analysis: "Dortmund's home form is electric — 6 of last 7 home wins ended 2-1 or 3-1. Leipzig's second half fades." },
];

const hasAccess = (tipLevel: Tip["level"], userPlan: PlanLevel): boolean => {
  if (userPlan === "PLATINUM") return true;
  if (userPlan === "GOLD" && tipLevel !== "PLATINUM") return true;
  if (userPlan === "SILVER" && tipLevel === "SILVER") return true;
  return false;
};

const LEVEL_COLOR: Record<Tip["level"], string> = {
  SILVER: "#94a3b8", GOLD: "#f59e0b", PLATINUM: "#818cf8",
};

const PremiumTips = () => {
  const { userPlan } = useAuth();
  const [activeLeague, setActiveLeague] = useState("All");
  const leagues = ["All", ...Array.from(new Set(TIPS.map((t) => t.league)))];
  const filtered = activeLeague === "All" ? TIPS : TIPS.filter((t) => t.league === activeLeague);
  const plan = (userPlan ?? "NONE") as PlanLevel;
  const accessibleCount = TIPS.filter((t) => hasAccess(t.level, plan)).length;

  return (
    <div className="premium-tips-page">
      <div className="pt-inner">
        <div className="pt-header">
          <p className="pt-eyebrow">Premium Predictions</p>
          <h1>Today's Expert Tips</h1>
          <p className="pt-date">{new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        {plan === "NONE" ? (
          <div className="access-banner locked-banner">
            <div>
              <p className="banner-title">🔒 Unlock All Premium Tips</p>
              <p className="banner-desc">You currently have no active subscription. Subscribe from KSH 50/day.</p>
            </div>
            <Link to="/subscribe" className="banner-btn">Subscribe Now</Link>
          </div>
        ) : (
          <div className="access-banner active-banner">
            <div>
              <p className="banner-title">✓ {plan} Plan Active</p>
              <p className="banner-desc">You have access to {accessibleCount} of {TIPS.length} tips today.</p>
            </div>
            <Link to="/subscribe" className="banner-btn-outline">Upgrade</Link>
          </div>
        )}

        <div className="league-filter">
          {leagues.map((l) => (
            <button key={l} className={`league-tab ${activeLeague === l ? "active" : ""}`} onClick={() => setActiveLeague(l)}>{l}</button>
          ))}
        </div>

        <div className="tips-grid">
          {filtered.map((tip) => {
            const canSee = hasAccess(tip.level, plan);
            return (
              <div key={tip.id} className={`tip-card ${!canSee ? "tip-locked" : ""}`}
                style={{ "--level-color": LEVEL_COLOR[tip.level] } as React.CSSProperties}>
                <div className="tip-card-inner">
                  <div className="tip-top">
                    <span className="tip-level-badge" style={{ color: LEVEL_COLOR[tip.level], borderColor: LEVEL_COLOR[tip.level] }}>{tip.level}</span>
                    <span className="tip-time">{tip.time}</span>
                  </div>
                  <p className="tip-league">{tip.league}</p>
                  <h3 className="tip-fixture">{tip.fixture}</h3>
                  <div className="tip-details">
                    <div className="tip-detail-row"><span className="detail-label">Prediction</span><span className="detail-value accent">{tip.tip}</span></div>
                    <div className="tip-detail-row"><span className="detail-label">Odds</span><span className="detail-value">{tip.odds}</span></div>
                  </div>
                  {canSee && <p className="tip-analysis">📊 {tip.analysis}</p>}
                </div>
                {!canSee && (
                  <div className="tip-lock-overlay">
                    <div className="lock-content">
                      <span className="lock-icon">🔒</span>
                      <p className="lock-plan">Requires {tip.level} plan</p>
                      <Link to="/subscribe" className="lock-btn">
                        Subscribe from KSH {tip.level === "SILVER" ? 50 : tip.level === "GOLD" ? 70 : 100}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumTips;
