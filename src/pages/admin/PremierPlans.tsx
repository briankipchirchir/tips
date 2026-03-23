import AdminLayout from "../../components/admin/AdminLayout";

const PLANS = [
  { level: "SILVER",     color: "#94a3b8", odds: "3–5",  prices: { "1 Day": 50, "3 Days": 120, "1 Week": 250, "1 Month": 800   } },
  { level: "GOLD",       color: "#f59e0b", odds: "5–7",  prices: { "1 Day": 70, "3 Days": 180, "1 Week": 380, "1 Month": 1200  } },
  { level: "PLATINUM",   color: "#818cf8", odds: "8–15", prices: { "1 Day": 100,"3 Days": 250, "1 Week": 500, "1 Month": 1800  } },
  { level: "VALUE_BETS", color: "#10b981", odds: "N/A",  prices: { "Access": 99 } },
];

const PremiumPlans = () => (
  <AdminLayout title="Premium Plans">
    <div style={{ display: "grid", gap: 20 }}>
      {PLANS.map((plan) => (
        <div className="admin-section" key={plan.level}>
          <div className="admin-section-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: plan.color, fontWeight: 800, fontSize: "1rem" }}>{plan.level}</span>
              {plan.odds !== "N/A" && <span className="badge badge-gray">{plan.odds} odds daily</span>}
            </div>
          </div>
          <div className="admin-section-body">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14 }}>
              {Object.entries(plan.prices).map(([dur, price]) => (
                <div key={dur} style={{ background: "#162032", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ color: "#64748b", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{dur}</div>
                  <div style={{ color: plan.color, fontSize: "1.5rem", fontWeight: 800 }}>KSH {price}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 8 }}>
              <p style={{ color: "#6ee7b7", fontSize: "0.8rem", margin: 0 }}>
                💡 Prices are managed in the backend. Update <code>SubscriptionService.getPrice()</code> to change pricing.
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </AdminLayout>
);

export default PremiumPlans;
