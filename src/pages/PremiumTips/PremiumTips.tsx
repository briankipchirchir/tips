import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { tipsApi } from "../../services/api";
import "./PremiumTips.css";

interface Tip {
  id: string;
  league: string;
  fixture: string;
  kickoffTime: string;
  prediction: string;
  odds: string;
  analysis: string;
  level: "FREE" | "SILVER" | "GOLD" | "PLATINUM";
  sent: boolean;
}

const LEVEL_COLOR: Record<string, string> = {
  FREE: "#10b981", SILVER: "#94a3b8", GOLD: "#f59e0b", PLATINUM: "#818cf8",
};

const PremiumTips = () => {
  const { userPlan } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLeague, setActiveLeague] = useState("All");

  useEffect(() => {
    tipsApi.getPremiumTips()
      .then((res) => setTips(res.data))
      .catch(() => setTips([]))
      .finally(() => setLoading(false));
  }, []);

  const leagues = ["All", ...Array.from(new Set(tips.map((t) => t.league)))];
  const filtered = activeLeague === "All" ? tips : tips.filter((t) => t.league === activeLeague);

  return (
    <div className="premium-tips-page">
      <div className="pt-inner">
        <div className="pt-header">
          <p className="pt-eyebrow">Premium Predictions</p>
          <h1>Today's Expert Tips</h1>
          <p className="pt-date">{new Date().toLocaleDateString("en-KE", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
          })}</p>
        </div>

        {userPlan === "NONE" ? (
          <div className="access-banner locked-banner">
            <div>
              <p className="banner-title">🔒 Unlock All Premium Tips</p>
              <p className="banner-desc">Subscribe from KSH 50/day to access expert tips.</p>
            </div>
            <Link to="/subscribe" className="banner-btn">Subscribe Now</Link>
          </div>
        ) : (
          <div className="access-banner active-banner">
            <div>
              <p className="banner-title">✓ {userPlan} Plan Active</p>
              <p className="banner-desc">You have access to {tips.length} tips today.</p>
            </div>
            <Link to="/subscribe" className="banner-btn-outline">Upgrade</Link>
          </div>
        )}

        <div className="league-filter">
          {leagues.map((l) => (
            <button key={l} className={`league-tab ${activeLeague === l ? "active" : ""}`}
              onClick={() => setActiveLeague(l)}>{l}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>Loading tips...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            <p style={{ fontSize: "2rem" }}>⚽</p>
            <p>No tips posted yet for today. Check back soon!</p>
            {userPlan === "NONE" && (
              <Link to="/subscribe" style={{ color: "#10b981", fontWeight: 700 }}>
                Subscribe to get notified via SMS →
              </Link>
            )}
          </div>
        ) : (
          <div className="tips-grid">
            {filtered.map((tip) => (
              <div key={tip.id} className="tip-card"
                style={{ "--level-color": LEVEL_COLOR[tip.level] } as React.CSSProperties}>
                <div className="tip-card-inner">
                  <div className="tip-top">
                    <span className="tip-level-badge"
                      style={{ color: LEVEL_COLOR[tip.level], borderColor: LEVEL_COLOR[tip.level] }}>
                      {tip.level}
                    </span>
                    <span className="tip-time">{tip.kickoffTime}</span>
                  </div>
                  <p className="tip-league">{tip.league}</p>
                  <h3 className="tip-fixture">{tip.fixture}</h3>
                  <div className="tip-details">
                    <div className="tip-detail-row">
                      <span className="detail-label">Prediction</span>
                      <span className="detail-value accent">{tip.prediction}</span>
                    </div>
                    <div className="tip-detail-row">
                      <span className="detail-label">Odds</span>
                      <span className="detail-value">{tip.odds || "N/A"}</span>
                    </div>
                  </div>
                  {tip.analysis && (
                    <p className="tip-analysis">📊 {tip.analysis}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumTips;
