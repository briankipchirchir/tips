import "./PremiumTipCard.css";

type TipLevel = "FREE" | "SILVER" | "GOLD" | "PLATINUM";

interface Props {
  league: string;
  fixture: string;
  tip: string;
  odds: string;
  level: TipLevel;
  userPlan: TipLevel | "NONE";
}

const PremiumTipCard = ({
  league,
  fixture,
  tip,
  odds,
  level,
  userPlan,
}: Props) => {
  const hasAccess =
    level === "FREE" ||
    userPlan === "PLATINUM" ||
    (userPlan === "GOLD" && level !== "PLATINUM") ||
    (userPlan === "SILVER" && level === "SILVER");

  return (
    <div className={`premium-card ${!hasAccess ? "locked" : ""}`}>
      <div className="card-content">
        <span className="badge">{level}</span>
        <p><strong>{league}</strong></p>
        <p>{fixture}</p>
        <p>Tip: {tip}</p>
        <p>Odds: {odds}</p>
      </div>

      {!hasAccess && (
        <div className="lock-overlay">
          <p>🔒 Premium Tip</p>
          <button>Subscribe to Unlock</button>
        </div>
      )}
    </div>
  );
};

export default PremiumTipCard;
