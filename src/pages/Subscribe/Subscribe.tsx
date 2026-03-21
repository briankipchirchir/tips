import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Subscribe.css";

type PlanLevel = "SILVER" | "GOLD" | "PLATINUM";
type Duration = "1day" | "3days" | "1week" | "1month";
type DeliveryMethod = "SMS" | "WhatsApp" | "Both";

interface PlanOption {
  level: PlanLevel;
  label: string;
  tagline: string;
  odds: string;
  color: string;
  prices: Record<Duration, number>;
}

const PLANS: PlanOption[] = [
  {
    level: "SILVER", label: "Silver", tagline: "Great for casual bettors",
    odds: "3–5 odds daily", color: "#94a3b8",
    prices: { "1day": 50, "3days": 120, "1week": 250, "1month": 800 },
  },
  {
    level: "GOLD", label: "Gold", tagline: "Most popular — consistent wins",
    odds: "5–7 odds daily", color: "#f59e0b",
    prices: { "1day": 70, "3days": 180, "1week": 380, "1month": 1200 },
  },
  {
    level: "PLATINUM", label: "Platinum", tagline: "Maximum returns for serious bettors",
    odds: "8–15 odds daily", color: "#818cf8",
    prices: { "1day": 100, "3days": 250, "1week": 500, "1month": 1800 },
  },
];

const DURATIONS: { key: Duration; label: string; save?: string }[] = [
  { key: "1day",   label: "1 Day" },
  { key: "3days",  label: "3 Days",  save: "Save 20%" },
  { key: "1week",  label: "1 Week",  save: "Save 28%" },
  { key: "1month", label: "1 Month", save: "Best Value" },
];

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; icon: string; desc: string }[] = [
  { value: "SMS",      icon: "📱", label: "SMS",      desc: "Tips sent as text message to your phone" },
  { value: "WhatsApp", icon: "💬", label: "WhatsApp", desc: "Tips sent to your WhatsApp number"       },
  { value: "Both",     icon: "📱💬", label: "Both",   desc: "Receive tips on both SMS & WhatsApp"     },
];

const Subscribe = () => {
  const { userPlan, subscribe } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan,     setSelectedPlan]     = useState<PlanLevel>("GOLD");
  const [selectedDuration, setSelectedDuration] = useState<Duration>("1week");
  const [delivery,         setDelivery]         = useState<DeliveryMethod | null>(null);
  const [phone,            setPhone]            = useState("");
  const [step,             setStep]             = useState<"select" | "success">("select");
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState("");

  const activePlan = PLANS.find((p) => p.level === selectedPlan)!;
  const price      = activePlan.prices[selectedDuration];

  const handlePay = async () => {
    if (!delivery) { setError("Please choose how you want to receive your tips."); return; }
    if (phone.length < 9) { setError("Enter a valid M-Pesa number."); return; }
    setError("");
    setLoading(true);
    // TODO: replace with real M-Pesa STK push + backend call
    await new Promise((r) => setTimeout(r, 2000));
    subscribe(selectedPlan, selectedDuration);
    setLoading(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="subscribe-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>You're subscribed!</h2>
          <p>
            Your <strong>{activePlan.label}</strong> plan is active. Tips will be
            sent to you via{" "}
            <strong>{delivery === "Both" ? "SMS & WhatsApp" : delivery}</strong>.
          </p>
          <button className="sub-btn" onClick={() => navigate("/premium-tips")}>
            View Premium Tips →
          </button>
          <button className="sub-btn-outline" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscribe-page">
      <div className="subscribe-inner">

        {/* Header */}
        <div className="sub-header">
          <p className="sub-eyebrow">Unlock Premium</p>
          <h1>Choose Your Plan</h1>
          <p className="sub-desc">All plans include daily tip delivery. Cancel anytime.</p>
        </div>

        {/* Duration Tabs */}
        <div className="duration-tabs">
          {DURATIONS.map((d) => (
            <button key={d.key} className={`dur-tab ${selectedDuration === d.key ? "active" : ""}`}
              onClick={() => setSelectedDuration(d.key)}>
              {d.label}
              {d.save && <span className="dur-save">{d.save}</span>}
            </button>
          ))}
        </div>

        {/* Plan Cards */}
        <div className="plan-grid">
          {PLANS.map((plan) => {
            const isActive = selectedPlan === plan.level;
            return (
              <div key={plan.level}
                className={`sub-plan-card ${isActive ? "selected" : ""}`}
                onClick={() => setSelectedPlan(plan.level)}
                style={{ "--plan-color": plan.color } as React.CSSProperties}>
                {plan.level === "GOLD" && <div className="popular-badge">Most Popular</div>}
                <div className="plan-top">
                  <span className="plan-label">{plan.label}</span>
                  {isActive && <span className="checkmark">✓</span>}
                </div>
                <p className="plan-odds">{plan.odds}</p>
                <p className="plan-tagline">{plan.tagline}</p>
                <div className="plan-price">
                  <span className="currency">KSH</span>
                  <span className="amount">{plan.prices[selectedDuration]}</span>
                  <span className="period">/{DURATIONS.find((d) => d.key === selectedDuration)?.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Box */}
        <div className="payment-box">

          {/* ── STEP 1: Delivery Method ── */}
          <div className="pay-step">
            <p className="pay-step-label">
              <span className="pay-step-num">1</span>
              How would you like to receive your tips?
            </p>
            <div className="delivery-options">
              {DELIVERY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`delivery-option ${delivery === opt.value ? "selected" : ""}`}
                  onClick={() => { setDelivery(opt.value); setError(""); }}
                >
                  <span className="delivery-icon">{opt.icon}</span>
                  <span className="delivery-label">{opt.label}</span>
                  <span className="delivery-desc">{opt.desc}</span>
                  {delivery === opt.value && <span className="delivery-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* ── STEP 2: M-Pesa ── */}
          <div className="pay-step">
            <p className="pay-step-label">
              <span className="pay-step-num">2</span>
              Pay via M-Pesa
            </p>
            <p className="pay-summary">
              {activePlan.label} Plan ·{" "}
              {DURATIONS.find((d) => d.key === selectedDuration)?.label} ·{" "}
              <strong>KSH {price}</strong>
            </p>
            <div className="mpesa-field">
              <div className="mpesa-flag">M-PESA</div>
              <input
                type="tel"
                placeholder="07XX XXX XXX"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                maxLength={10}
              />
            </div>
          </div>

          {error && <p className="pay-error">{error}</p>}

          <button className="sub-btn" onClick={handlePay} disabled={loading}>
            {loading
              ? <><span className="spinner" /> Sending STK Push...</>
              : `Pay KSH ${price} Now`}
          </button>
          <p className="pay-note">
            ✓ You'll receive an M-Pesa prompt on your phone to confirm payment
          </p>
        </div>

        {userPlan && userPlan !== "NONE" && (
          <div className="current-plan-notice">
            You currently have an active <strong>{userPlan}</strong> plan.
            Subscribing will upgrade or extend it.
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
