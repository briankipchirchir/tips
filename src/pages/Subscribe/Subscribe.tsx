import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentsApi } from "../../services/api";
import "./Subscribe.css";

type PlanLevel = "SILVER" | "GOLD" | "PLATINUM";
type Duration = "1day" | "3days" | "1week" | "1month";

const PLANS = [
  { level: "SILVER" as PlanLevel, label: "Silver", tagline: "Great for casual bettors",
    odds: "3–5 odds daily", color: "#94a3b8",
    prices: { "1day": 50, "3days": 120, "1week": 250, "1month": 800 } },
  { level: "GOLD" as PlanLevel, label: "Gold", tagline: "Most popular — consistent wins",
    odds: "5–7 odds daily", color: "#f59e0b",
    prices: { "1day": 70, "3days": 180, "1week": 380, "1month": 1200 } },
  { level: "PLATINUM" as PlanLevel, label: "Platinum", tagline: "Maximum returns",
    odds: "8–15 odds daily", color: "#818cf8",
    prices: { "1day": 100, "3days": 250, "1week": 500, "1month": 1800 } },
];

const DURATIONS: { key: Duration; label: string; save?: string }[] = [
  { key: "1day", label: "1 Day" },
  { key: "3days", label: "3 Days", save: "Save 20%" },
  { key: "1week", label: "1 Week", save: "Save 28%" },
  { key: "1month", label: "1 Month", save: "Best Value" },
];

const DURATION_MAP: Record<Duration, string> = {
  "1day": "ONE_DAY", "3days": "THREE_DAYS", "1week": "ONE_WEEK", "1month": "ONE_MONTH",
};

const Subscribe = () => {
  const { userPlan, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<PlanLevel>("GOLD");
  const [selectedDuration, setSelectedDuration] = useState<Duration>("1week");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [smsNumber, setSmsNumber] = useState("");
  const [sameNumber, setSameNumber] = useState(true);
  const [step, setStep] = useState<"select" | "success">("select");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activePlan = PLANS.find((p) => p.level === selectedPlan)!;
  const price = activePlan.prices[selectedDuration];
  const effectiveSmsNumber = sameNumber ? mpesaNumber : smsNumber;

  const handlePay = async () => {
    if (mpesaNumber.length < 9) { setError("Enter a valid M-Pesa number."); return; }
    if (!sameNumber && smsNumber.length < 9) { setError("Enter a valid SMS number."); return; }
    setError("");
    setLoading(true);
    try {
      await paymentsApi.initiateStk({
        mpesaPhone: mpesaNumber,
        smsPhone: effectiveSmsNumber,
        planLevel: selectedPlan,
        duration: DURATION_MAP[selectedDuration],
      });
      await refreshProfile();
      setStep("success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="subscribe-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>STK Push Sent!</h2>
          <p>Check your phone <strong>{mpesaNumber}</strong> for the M-Pesa prompt. Enter your PIN to complete payment. Tips will be sent to <strong>{effectiveSmsNumber}</strong> via SMS.</p>
          <button className="sub-btn" onClick={() => navigate("/premium-tips")}>View Premium Tips →</button>
          <button className="sub-btn-outline" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscribe-page">
      <div className="subscribe-inner">
        <div className="sub-header">
          <p className="sub-eyebrow">Unlock Premium</p>
          <h1>Choose Your Plan</h1>
          <p className="sub-desc">Tips delivered instantly via SMS. Cancel anytime.</p>
        </div>

        <div className="duration-tabs">
          {DURATIONS.map((d) => (
            <button key={d.key} className={`dur-tab ${selectedDuration === d.key ? "active" : ""}`}
              onClick={() => setSelectedDuration(d.key)}>
              {d.label}{d.save && <span className="dur-save">{d.save}</span>}
            </button>
          ))}
        </div>

        <div className="plan-grid">
          {PLANS.map((plan) => (
            <div key={plan.level}
              className={`sub-plan-card ${selectedPlan === plan.level ? "selected" : ""}`}
              onClick={() => setSelectedPlan(plan.level)}
              style={{ "--plan-color": plan.color } as React.CSSProperties}>
              {plan.level === "GOLD" && <div className="popular-badge">Most Popular</div>}
              <div className="plan-top">
                <span className="plan-label">{plan.label}</span>
                {selectedPlan === plan.level && <span className="checkmark">✓</span>}
              </div>
              <p className="plan-odds">{plan.odds}</p>
              <p className="plan-tagline">{plan.tagline}</p>
              <div className="plan-price">
                <span className="currency">KSH</span>
                <span className="amount">{plan.prices[selectedDuration]}</span>
                <span className="period">/{DURATIONS.find((d) => d.key === selectedDuration)?.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="payment-box">
          <div className="pay-step">
            <p className="pay-step-label"><span className="pay-step-num">1</span>M-Pesa payment number</p>
            <p className="pay-summary">{activePlan.label} · {DURATIONS.find((d) => d.key === selectedDuration)?.label} · <strong>KSH {price}</strong></p>
            <div className="mpesa-field">
              <div className="mpesa-flag">M-PESA</div>
              <input type="tel" placeholder="07XX XXX XXX" value={mpesaNumber}
                onChange={(e) => { setMpesaNumber(e.target.value); setError(""); }} maxLength={10} />
            </div>
          </div>

          <div className="pay-step">
            <p className="pay-step-label"><span className="pay-step-num">2</span>SMS number to receive tips</p>
            <label className="same-number-label">
              <input type="checkbox" checked={sameNumber}
                onChange={(e) => { setSameNumber(e.target.checked); setError(""); }} />
              <span>Same as M-Pesa number</span>
            </label>
            {!sameNumber && (
              <div className="sms-field">
                <span className="sms-prefix">📱 +254</span>
                <input type="tel" placeholder="7XX XXX XXX" value={smsNumber}
                  onChange={(e) => { setSmsNumber(e.target.value); setError(""); }} maxLength={10} />
              </div>
            )}
            {sameNumber && mpesaNumber && (
              <p className="sms-confirm">✓ Tips will be sent to <strong>{mpesaNumber}</strong></p>
            )}
          </div>

          {error && <p className="pay-error">{error}</p>}

          <button className="sub-btn" onClick={handlePay} disabled={loading}>
            {loading ? <><span className="spinner" /> Sending STK Push...</> : `Pay KSH ${price} Now`}
          </button>
          <p className="pay-note">✓ You'll receive an M-Pesa prompt on your phone to confirm payment</p>
        </div>

        {userPlan && userPlan !== "NONE" && (
          <div className="current-plan-notice">
            You currently have an active <strong>{userPlan}</strong> plan. Subscribing will upgrade or extend it.
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
