import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ValueBets.css";

export interface Prediction {
  id: number;
  matchNum: number;
  league: string;
  date: string;
  fixture: string;
  pick: string;
  odds: string;
  confidence: number;
  analysis: string;
}

interface Props {
  title: string;
  eyebrow: string;
  description: string;
  jackpotInfo?: { label: string; value: string; highlight?: boolean }[];
  predictions: Prediction[];
}

const TABS = [
  { label: "SportPesa Jackpot", path: "/value-bets/sportpesa" },
  { label: "Betika Jackpot",    path: "/value-bets/betika" },
  { label: "Correct Score",     path: "/value-bets/correct-score" },
  { label: "Goal Range",        path: "/value-bets/goal-range" },
];

const ValueBetsLayout = ({ title, eyebrow, description, jackpotInfo, predictions }: Props) => {
  const { userPlan } = useAuth();
  const location = useLocation();
  const isSubscribed = userPlan && userPlan !== "NONE";

  return (
    <div className="vb-page">
      <div className="vb-inner">
        {/* Header */}
        <div className="vb-header">
          <p className="vb-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {/* Tab Nav */}
        <div className="vb-tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`vb-tab ${location.pathname === tab.path ? "active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Lock Banner */}
        {!isSubscribed && (
          <div className="vb-lock-banner">
            <div>
              <h3>🔒 Subscription Required</h3>
              <p>Value Bets predictions are available to all active subscribers. Subscribe from KSH 50/day.</p>
            </div>
            <Link to="/subscribe" className="vb-subscribe-btn">Subscribe Now</Link>
          </div>
        )}

        {/* Jackpot Info Bar */}
        {jackpotInfo && jackpotInfo.length > 0 && (
          <div className="vb-info-bar">
            {jackpotInfo.map((item, i) => (
              <div className="vb-info-item" key={i}>
                <span className="vb-info-label">{item.label}</span>
                <span className={`vb-info-value ${item.highlight ? "green" : ""}`}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Predictions */}
        {predictions.length === 0 ? (
          <div className="vb-empty">
            <div className="vb-empty-icon">📋</div>
            <h3>No predictions yet</h3>
            <p>Admin will post predictions for this category soon. Check back later.</p>
          </div>
        ) : (
          <div className={`vb-predictions ${!isSubscribed ? "locked" : ""}`}>
            {predictions.map((p, index) => {
              const isLocked = !isSubscribed && index >= 2;
              return (
                <div className="vb-card" key={p.id}>
                  <div className="vb-card-main">
                    <div className="vb-match-info">
                      <div className="vb-match-num">Match {p.matchNum}</div>
                      <div className="vb-league-date">{p.league} · {p.date}</div>
                      <div className="vb-fixture">{p.fixture}</div>
                    </div>

                    <div className="vb-pick-box">
                      <div className="vb-pick-label">Pick</div>
                      <div className="vb-pick-value">{p.pick}</div>
                    </div>

                    <div className="vb-odds-box">
                      <div className="vb-odds-label">Odds</div>
                      <div className="vb-odds-value">{p.odds}</div>
                    </div>

                    <div className="vb-conf-box">
                      <div className="vb-conf-label">Confidence</div>
                      <div className="vb-conf-bar">
                        <div className="vb-conf-fill" style={{ width: `${p.confidence}%` }} />
                      </div>
                      <div className="vb-conf-pct">{p.confidence}%</div>
                    </div>
                  </div>

                  <div className="vb-card-analysis">
                    <span className="vb-analysis-icon">📊</span>
                    <span className="vb-analysis-text">{p.analysis}</span>
                  </div>

                  {isLocked && (
                    <div className="vb-card-lock-overlay">
                      <span>🔒</span>
                      <Link to="/subscribe">Subscribe to unlock</Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValueBetsLayout;
