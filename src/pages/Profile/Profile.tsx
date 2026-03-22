import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const PLAN_META: Record<string, { color: string; label: string; odds: string }> = {
  SILVER:   { color: "#94a3b8", label: "Silver",   odds: "3–5 odds"      },
  GOLD:     { color: "#f59e0b", label: "Gold",     odds: "5–7 odds"      },
  PLATINUM: { color: "#818cf8", label: "Platinum", odds: "8–15 odds"     },
  NONE:     { color: "#475569", label: "Free",     odds: "Free tips only" },
};

const Profile = () => {
  const { user, userPlan, subscriptionExpiry, logout } = useAuth();
  const navigate = useNavigate();

  const planMeta = PLAN_META[userPlan ?? "NONE"];
  const isSubscribed = userPlan && userPlan !== "NONE";
  const daysLeft = subscriptionExpiry
    ? Math.max(0, Math.ceil((new Date(subscriptionExpiry).getTime() - Date.now()) / 86400000))
    : 0;

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card centered">
          <p className="profile-no-user">You are not logged in.</p>
          <Link to="/login" className="profile-btn">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-inner">
        <div className="profile-hero">
          <div className="profile-avatar">
            {user.fullName?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div>
            <h1 className="profile-name">{user.fullName}</h1>
            <p className="profile-phone">📱 {user.phone}</p>
            <p className="profile-phone">SMS: {user.smsNumber}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-label">Subscription</h2>
          <div className="sub-status-card"
            style={{ "--plan-color": planMeta.color } as React.CSSProperties}>
            <div className="sub-status-left">
              <span className="sub-badge" style={{ color: planMeta.color }}>
                {planMeta.label} Plan
              </span>
              <p className="sub-odds">{planMeta.odds}</p>
              {isSubscribed && subscriptionExpiry && (
                <p className="sub-expiry">
                  Expires: {new Date(subscriptionExpiry).toLocaleDateString("en-KE", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                  {" · "}
                  <span className={daysLeft <= 1 ? "expiry-urgent" : "expiry-safe"}>
                    {daysLeft === 0 ? "Expires today" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`}
                  </span>
                </p>
              )}
            </div>
            <div className="sub-status-right">
              {isSubscribed
                ? <span className="active-pill">● Active</span>
                : <span className="inactive-pill">No Plan</span>}
            </div>
          </div>
          {!isSubscribed
            ? <Link to="/subscribe" className="profile-btn full-width">Get Premium Access</Link>
            : <Link to="/subscribe" className="profile-btn-outline full-width">Upgrade / Extend Plan</Link>}
        </div>

        <div className="profile-section">
          <h2 className="section-label">Quick Access</h2>
          <div className="quick-links">
            <Link to="/" className="quick-link-card"><span className="ql-icon">🏠</span><span>Home</span></Link>
            <Link to="/free-tips" className="quick-link-card"><span className="ql-icon">⚽</span><span>Free Tips</span></Link>
            <Link to="/premium-tips" className="quick-link-card"><span className="ql-icon">⭐</span><span>Premium</span></Link>
            <Link to="/subscribe" className="quick-link-card"><span className="ql-icon">💎</span><span>Subscribe</span></Link>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-label">Account</h2>
          <div className="account-actions">
            <button className="action-row"><span>✏️ Edit Profile</span><span className="chevron">›</span></button>
            <button className="action-row"><span>🔒 Change Password</span><span className="chevron">›</span></button>
            <button className="action-row logout-row"
              onClick={() => { logout(); navigate("/"); }}>
              <span>🚪 Sign Out</span><span className="chevron">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
