import {  useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentsApi } from "../../services/api";
import "./Subscribe.css";

type PlanLevel = "SILVER" | "GOLD" | "PLATINUM" | "VALUE_BETS";
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
  { key: "1day",   label: "1 Day" },
  { key: "3days",  label: "3 Days",  save: "Save 20%" },
  { key: "1week",  label: "1 Week",  save: "Save 28%" },
  { key: "1month", label: "1 Month", save: "Best Value" },
];

const DURATION_MAP: Record<Duration, string> = {
  "1day": "ONE_DAY", "3days": "THREE_DAYS",
  "1week": "ONE_WEEK", "1month": "ONE_MONTH",
};

const Subscribe = () => {
  const { userPlan, refreshProfile,user, loading: authLoading  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedPlan,     setSelectedPlan]     = useState<PlanLevel>("GOLD");
  const [selectedDuration, setSelectedDuration] = useState<Duration>("1week");
  const [mpesaNumber,      setMpesaNumber]      = useState("");
  const [smsNumber,        setSmsNumber]        = useState("");
  const [sameNumber,       setSameNumber]       = useState(true);
  const [step, setStep] = useState<"select" | "waiting" | "confirmed" | "failed">("select");
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState("");
  const [activeTab,        setActiveTab]        = useState<"tips" | "valuebets">(searchParams.get("tab") === "valuebets" ? "valuebets" : "tips");

  const activePlan = PLANS.find((p) => p.level === selectedPlan);
  const price = activeTab === "valuebets" ? 99 : (activePlan?.prices[selectedDuration] ?? 0);
  const effectiveSmsNumber = sameNumber ? mpesaNumber : smsNumber;
  const payPlan: PlanLevel = activeTab === "valuebets" ? "VALUE_BETS" : selectedPlan;
  const payDuration = activeTab === "valuebets" ? "ONE_DAY" : DURATION_MAP[selectedDuration];
  const [paymentRef, setPaymentRef] = useState("");
const [polling,    setPolling]    = useState(false);


  
const startPolling = (ref: string) => {
  setPolling(true);
  let attempts = 0;
  const maxAttempts = 24; // 2 minutes max

  const interval = setInterval(async () => {
    attempts++;
    try {
      const res = await paymentsApi.checkPaymentStatus(ref);
      const status = res.data.status;

      if (status === "SUCCESS") {
        clearInterval(interval);
        setPolling(false);
        await refreshProfile();
        setStep("confirmed");
        startPolling(paymentRef);
      } else if (status === "FAILED" || attempts >= maxAttempts) {
        clearInterval(interval);
        setPolling(false);
        setStep(status === "FAILED" ? "failed" : "waiting");
      }
    } catch {
      // keep polling silently
    }
  }, 5000);
};

 const handlePay = async () => {
  if (!authLoading && !user) { navigate("/login?redirect=/subscribe"); return; }
  if (mpesaNumber.length < 9) { setError("Enter a valid M-Pesa number."); return; }
  if (!sameNumber && smsNumber.length < 9) { setError("Enter a valid SMS number."); return; }
  setError("");
  setLoading(true);
  try {
    const res = await paymentsApi.initiateStk({
      mpesaPhone: mpesaNumber,
      smsPhone: effectiveSmsNumber,
      planLevel: payPlan,
      duration: payDuration,
    });
    const ref = res.data.checkoutRequestId;
    setPaymentRef(ref);
    setStep("waiting");
    startPolling(ref);
  } catch (err: any) {
    setError(err.response?.data?.message || "Payment failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

 if (step === "waiting") {
  return (
    <div className="subscribe-page">
      <div className="success-card">
        <div className="success-icon">📱</div>
        <h2>Check Your Phone!</h2>
        <p>An M-Pesa prompt has been sent to <strong>{mpesaNumber}</strong>. Enter your PIN to complete payment.</p>
        {polling && (
          <div style={{ display: "flex", alignItems: "center", gap: 8,
                        justifyContent: "center", color: "#10b981", margin: "16px 0" }}>
            <span className="spinner" />
            <span style={{ color: "#94a3b8" }}>Waiting for confirmation...</span>
          </div>
        )}
        <p style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: 8 }}>
          This page updates automatically once payment is confirmed.
        </p>
        <button className="sub-btn-outline" style={{ marginTop: 16 }}
          onClick={() => { setPolling(false); setStep("select"); }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

if (step === "confirmed") {
  return (
    <div className="subscribe-page">
      <div className="success-card">
        <div className="success-icon" style={{ background: "#064e3b", color: "#10b981", fontSize: "2rem" }}>🎉</div>
        <h2 style={{ color: "#10b981" }}>Payment Confirmed!</h2>
        <p>Your <strong>{payPlan}</strong> plan is now active. Tips will be sent to <strong>{effectiveSmsNumber}</strong> via SMS.</p>
        <button className="sub-btn" onClick={() =>
          navigate(activeTab === "valuebets" ? "/value-bets/sportpesa" : "/premium-tips")
        }>
          View Your Tips →
        </button>
        <button className="sub-btn-outline" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
}

if (step === "failed") {
  return (
    <div className="subscribe-page">
      <div className="success-card">
        <div className="success-icon" style={{ background: "#7f1d1d", color: "#ef4444", fontSize: "2rem" }}>✕</div>
        <h2 style={{ color: "#ef4444" }}>Payment Failed</h2>
        <p>The payment was not completed. Please try again.</p>
        <button className="sub-btn" onClick={() => setStep("select")}>Try Again</button>
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

        {/* Tab selector */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
          <button
            onClick={() => setActiveTab("tips")}
            className={activeTab === "tips" ? "dur-tab active" : "dur-tab"}>
            ⚽ Daily Tips Plans
          </button>
          <button
            onClick={() => setActiveTab("valuebets")}
            className={activeTab === "valuebets" ? "dur-tab active" : "dur-tab"}>
            🎯 Value Bets — KSH 99
          </button>
        </div>

        {activeTab === "tips" ? (
          <>
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
          </>
        ) : (
          <div style={{ background: "#0f172a", border: "2px solid #10b981", borderRadius: 16, padding: 28, maxWidth: 480, margin: "0 auto 32px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🎯</div>
            <h2 style={{ color: "#f1f5f9", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 8px" }}>Value Bets Access</h2>
            <p style={{ color: "#64748b", marginBottom: 20 }}>
              Get access to SportPesa Jackpot, Betika Jackpot, Correct Score & Goal Range predictions.
            </p>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 8 }}>
              <span style={{ color: "#64748b", fontSize: "0.9rem" }}>KSH</span>
              <span style={{ color: "#10b981", fontSize: "3rem", fontWeight: 800 }}>99</span>
              <span style={{ color: "#64748b" }}>/access</span>
            </div>
            <p style={{ color: "#475569", fontSize: "0.8rem" }}>One-time payment — no recurring charge</p>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
              {["SportPesa Mega Jackpot picks", "Betika Midweek Jackpot picks", "Correct Score predictions", "Goal Range (Over/Under) tips", "Detailed match analysis"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: "0.875rem" }}>
                  <span style={{ color: "#10b981" }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Box */}
        <div className="payment-box">
          <div className="pay-step">
            <p className="pay-step-label">
              <span className="pay-step-num">1</span>M-Pesa payment number
            </p>
            <p className="pay-summary">
              {activeTab === "valuebets" ? "Value Bets Access" : `${activePlan?.label} Plan · ${DURATIONS.find((d) => d.key === selectedDuration)?.label}`}
              {" · "}<strong>KSH {price}</strong>
            </p>
            <div className="mpesa-field">
              <div className="mpesa-flag">M-PESA</div>
              <input type="tel" placeholder="07XX XXX XXX" value={mpesaNumber}
                onChange={(e) => { setMpesaNumber(e.target.value); setError(""); }} maxLength={10} />
            </div>
          </div>

          <div className="pay-step">
            <p className="pay-step-label">
              <span className="pay-step-num">2</span>SMS number to receive tips
            </p>
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
