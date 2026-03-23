import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { valueBetsApi } from "../../services/api";
import "./ValueBets.css";

export interface Prediction {
  id: string;
  matchNumber: number;
  league: string;
  gameDate: string;
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
  category: string;
  jackpotInfo?: { label: string; value: string; highlight?: boolean }[];
}

const TABS = [
  { label: "SportPesa Jackpot", path: "/value-bets/sportpesa",     category: "SPORTPESA"     },
  { label: "Betika Jackpot",    path: "/value-bets/betika",        category: "BETIKA"        },
  { label: "Correct Score",     path: "/value-bets/correct-score", category: "CORRECT_SCORE" },
  { label: "Goal Range",        path: "/value-bets/goal-range",    category: "GOAL_RANGE"    },
];

const ValueBetsLayout = ({ title, eyebrow, description, category, jackpotInfo }: Props) => {
  const { userPlan } = useAuth();
  const location = useLocation();
  const isSubscribed = userPlan && (userPlan === "VALUE_BETS" || userPlan === "SILVER" || userPlan === "GOLD" || userPlan === "PLATINUM");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    valueBetsApi.getByCategory(category.toLowerCase().replace("_", "-"))
      .then((res) => setPredictions(res.data))
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="vb-page">
      <div className="vb-inner">
        <div className="vb-header">
          <p className="vb-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="vb-tabs">
          {TABS.map((tab) => (
            <Link key={tab.path} to={tab.path}
              className={`vb-tab ${location.pathname === tab.path ? "active" : ""}`}>
              {tab.label}
            </Link>
          ))}
        </div>

        {!isSubscribed && (
          <div className="vb-lock-banner">
            <div>
              <h3>🔒 Subscription Required</h3>
              <p>Value Bets predictions are available to all active subscribers. Subscribe from KSH 50/day.</p>
            </div>
            <Link to="/subscribe?tab=valuebets" className="vb-subscribe-btn">Subscribe Now — KSH 99</Link>
          </div>
        )}

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

        {loading ? (
          <div className="vb-empty">
            <div className="vb-empty-icon">⏳</div>
            <h3>Loading predictions...</h3>
          </div>
        ) : predictions.length === 0 ? (
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
                      <div className="vb-match-num">Match {p.matchNumber}</div>
                      <div className="vb-league-date">{p.league} · {p.gameDate}</div>
                      <div className="vb-fixture">{p.fixture}</div>
                    </div>
                    <div className="vb-pick-box">
                      <div className="vb-pick-label">Pick</div>
                      <div className="vb-pick-value">{p.pick}</div>
                    </div>
                    <div className="vb-odds-box">
                      <div className="vb-odds-label">Odds</div>
                      <div className="vb-odds-value">{p.odds || "N/A"}</div>
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
                      <Link to="/subscribe?tab=valuebets">Subscribe — KSH 99</Link>
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
