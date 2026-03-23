import { useState, useEffect } from "react";
import "./Home.css";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { tipsApi } from "../../services/api";

interface Tip {
  id: string;
  league: string;
  fixture: string;
  prediction: string;
  odds: string;
  kickoffTime: string;
  level: string;
}

const Home = () => {
  const [activeDay, setActiveDay] = useState<"yesterday" | "today" | "tomorrow">("today");
  const [openPlan, setOpenPlan] = useState<string | null>(null);
  const [wonTipsFilter, setWonTipsFilter] = useState<"yesterday" | "today" | "week">("today");
  const [freeTips, setFreeTips] = useState<Tip[]>([]);
  const [premiumTips, setPremiumTips] = useState<Tip[]>([]);
  const [tipsLoading, setTipsLoading] = useState(true);

  const { userPlan, user } = useAuth();
  const navigate = useNavigate();

  const getDate = (day: "yesterday" | "today" | "tomorrow") => {
    const d = new Date();
    if (day === "yesterday") d.setDate(d.getDate() - 1);
    if (day === "tomorrow") d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  // Fetch free tips when day changes
  useEffect(() => {
    setTipsLoading(true);
    tipsApi.getFreeTips(getDate(activeDay))
      .then((res) => setFreeTips(res.data))
      .catch(() => setFreeTips([]))
      .finally(() => setTipsLoading(false));
  }, [activeDay]);

  // Fetch premium tips preview on mount
  useEffect(() => {
    tipsApi.getPremiumTips()
      .then((res) => setPremiumTips(res.data.slice(0, 3)))
      .catch(() => setPremiumTips([]));
  }, []);

  const togglePlan = (plan: string) => {
    setOpenPlan(openPlan === plan ? null : plan);
  };

  const LEVEL_COLOR: Record<string, string> = {
    FREE: "#10b981", SILVER: "#94a3b8", GOLD: "#f59e0b", PLATINUM: "#818cf8",
  };

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <p className="hero-tag">Welcome to BetTips</p>
        <h1>Your Ultimate Source for Accurate Football Predictions</h1>
        <p className="hero-sub">Expert analysis, reliable tips, and daily winning strategies.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/free-tips")}>View Free Tips</button>
          <button className="btn-outline" onClick={() => navigate("/subscribe")}>Subscribe Now</button>
        </div>
      </section>

      {/* FREE TIPS PREVIEW */}
      <section className="section" id="free-tips">
        <div className="section-header">
          <h2 className="section-title">Free Guaranteed Tips</h2>
          <Link to="/free-tips" className="filter-btn" style={{ textDecoration: 'none', color: '#022c22', fontSize: '0.875rem', fontWeight: '600' }}>
            View All →
          </Link>
        </div>

        <div className="filters">
          {(["yesterday", "today", "tomorrow"] as const).map((d) => (
            <button key={d} className={activeDay === d ? "active" : ""} onClick={() => setActiveDay(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {tipsLoading ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Loading tips...</p>
        ) : freeTips.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
            No free tips available for this day yet.
          </p>
        ) : (
          <table className="tips-table">
            <thead>
              <tr><th>Time</th><th>League</th><th>Fixture</th><th>Tip</th></tr>
            </thead>
            <tbody>
              {freeTips.map((tip) => (
                <tr key={tip.id}>
                  <td>{tip.kickoffTime}</td>
                  <td>{tip.league}</td>
                  <td>{tip.fixture}</td>
                  <td>{tip.prediction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/free-tips" style={{ display: 'inline-block', padding: '10px 28px', background: 'transparent', border: '1.5px solid #22c55e', color: '#22c55e', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
            See All Free Tips →
          </Link>
        </div>
      </section>

      {/* TODAY'S PREMIUM TIPS PREVIEW */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Today's Premium Tips</h2>
          <Link to="/premium-tips" className="filter-btn" style={{ textDecoration: 'none', color: '#022c22', fontSize: '0.875rem', fontWeight: '600' }}>
            View All →
          </Link>
        </div>

        {premiumTips.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
            No premium tips posted yet today.
          </p>
        ) : (
          <div className="plans">
            {premiumTips.map((tip) => (
              <div key={tip.id} style={{ background: '#0f172a', border: `1px solid ${LEVEL_COLOR[tip.level] || '#1e293b'}`, borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                <span style={{ display: 'inline-block', background: '#22c55e', color: '#022c22', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', marginBottom: '10px', fontWeight: '700' }}>
                  {tip.level}
                </span>
                {userPlan === "NONE" || (tip.level === "GOLD" && userPlan === "SILVER") || (tip.level === "PLATINUM" && userPlan !== "PLATINUM") ? (
                  <div style={{ filter: 'blur(4px)', pointerEvents: 'none' }}>
                    <p style={{ color: '#e5e7eb', fontWeight: '600' }}>{tip.league}</p>
                    <p style={{ color: '#e5e7eb' }}>{tip.fixture}</p>
                    <p style={{ color: '#10b981' }}>Tip: {tip.prediction}</p>
                    <p style={{ color: '#f59e0b' }}>Odds: {tip.odds}</p>
                  </div>
                ) : (
                  <>
                    <p style={{ color: '#e5e7eb', fontWeight: '600' }}>{tip.league}</p>
                    <p style={{ color: '#e5e7eb' }}>{tip.fixture}</p>
                    <p style={{ color: '#10b981' }}>Tip: {tip.prediction}</p>
                    <p style={{ color: '#f59e0b' }}>Odds: {tip.odds}</p>
                  </>
                )}
                {(userPlan === "NONE") && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <p style={{ color: 'white' }}>🔒 Premium Tip</p>
                    <button onClick={() => navigate('/subscribe')} style={{ background: '#22c55e', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                      Subscribe to Unlock
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/premium-tips" style={{ display: 'inline-block', padding: '10px 28px', background: 'transparent', border: '1.5px solid #22c55e', color: '#22c55e', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
            View All Premium Tips →
          </Link>
        </div>
      </section>

      {/* PREMIUM PLANS */}
      <section className="section dark" id="premium-plans">
        <h2 className="section-title" style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Premium Plans</h2>
        <div className="plans" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {[
            { label: 'Silver Plan', bg: '#d1fae5', color: '#065f46', stars: '⭐⭐⭐⭐⭐', desc: 'Get sure 3-5 odds daily and earn consistently. Tips are sent instantly via SMS.', price: 'KSH. 50' },
            { label: 'Gold Plan',   bg: '#fef3c7', color: '#92400e', stars: '⭐⭐⭐⭐✨', desc: 'Get sure 5-7 odds daily and earn consistently. Tips are sent instantly via SMS.', price: 'KSH. 70' },
            { label: 'Platinum Plan', bg: '#e0e7ff', color: '#3730a3', stars: '⭐⭐⭐⭐☆', desc: 'Get sure 8-15 odds daily and earn consistently. Tips are sent instantly via SMS.', price: 'KSH. 100' },
          ].map((plan) => (
            <div key={plan.label} style={{ backgroundColor: '#1a2332', borderRadius: '12px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ backgroundColor: plan.bg, color: plan.color, padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>{plan.label}</span>
                <div style={{ color: '#fbbf24', fontSize: '1.25rem' }}>{plan.stars}</div>
              </div>
              <p style={{ color: '#e5e7eb', marginBottom: '1.5rem', lineHeight: '1.6' }}>{plan.desc}</p>
              <button onClick={() => navigate("/subscribe")} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                BUY @{plan.price}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/subscribe" style={{ display: 'inline-block', padding: '12px 36px', background: '#10b981', color: 'white', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '1rem' }}>
            See All Plans & Durations →
          </Link>
        </div>
      </section>

      {/* VALUE BETS */}
      <section className="section">
        <h2 className="section-title">Value Bets</h2>
        <div className="value-bets">
          <Link to="/value-bets/sportpesa" className="value-card">SportPesa Jackpot</Link>
          <Link to="/value-bets/betika" className="value-card">Betika Jackpot</Link>
          <Link to="/value-bets/correct-score" className="value-card">Correct Score</Link>
          <Link to="/value-bets/goal-range" className="value-card">Goal Range</Link>
        </div>
      </section>

      {/* RECENTLY WON PREMIUM TIPS */}
      <section className="section" style={{ backgroundColor: '#f3f4f6', padding: '3rem 1rem' }}>
        <div style={{ backgroundColor: 'white', maxWidth: '900px', margin: '0 auto', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
            Recently Won Premium Tips
          </h2>
          <div className="filters" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {(['yesterday', 'today', 'week'] as const).map((f) => (
              <button key={f} className={wonTipsFilter === f ? "active" : ""} onClick={() => setWonTipsFilter(f)}
                style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', border: wonTipsFilter === f ? '2px solid #10b981' : '2px solid #e5e7eb', backgroundColor: wonTipsFilter === f ? '#10b981' : 'white', color: wonTipsFilter === f ? 'white' : '#6b7280', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>
                {f === 'week' ? 'This Week' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {[
            { key: 'silver', label: 'Silver Plan', rows: [{ league: 'EPL', match: 'Arsenal vs Liverpool', tip: 'Over 2.5' }] },
            { key: 'gold',   label: 'Gold Plan',   rows: [{ league: 'La Liga', match: 'Barcelona vs Madrid', tip: 'BTTS' }] },
            { key: 'platinum', label: 'Platinum Plan', rows: [{ league: 'UCL', match: 'Bayern vs PSG', tip: 'Home Win' }] },
          ].map(({ key, label, rows }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <button onClick={() => togglePlan(key)} style={{ width: '100%', backgroundColor: '#f9fafb', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.125rem', fontWeight: '600' }}>
                <span>{label}</span>
                <span style={{ fontSize: '1.5rem' }}>{openPlan === key ? '▼' : '▶'}</span>
              </button>
              {openPlan === key && (
                <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', marginTop: '0.5rem', borderRadius: '8px' }}>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    {wonTipsFilter === 'yesterday' && `Yesterday's winning ${label} tips`}
                    {wonTipsFilter === 'today' && `Today's winning ${label} tips`}
                    {wonTipsFilter === 'week' && `This week's winning ${label} tips`}
                  </p>
                  <table style={{ width: '100%', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>League</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Match</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Tip</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ padding: '0.5rem' }}>{row.league}</td>
                          <td style={{ padding: '0.5rem' }}>{row.match}</td>
                          <td style={{ padding: '0.5rem' }}>{row.tip}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Won</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/premium-tips" style={{ display: 'inline-block', padding: '10px 28px', background: '#10b981', color: 'white', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>
              View Today's Premium Tips →
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section" style={{ backgroundColor: '#ffffff', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <p style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>WHY CHOOSE US</p>
          <h2 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.3' }}>
            Best Football Predictions & Betting Tips in Kenya
          </h2>
          <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            Get accurate football betting predictions from Kenya's leading tipsters. We deliver data-driven analysis, sure odds, and winning strategies for Premier League, Champions League, Kenyan Premier League, and 40+ international leagues.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { bg: '#d1fae5', iconColor: '#10b981', icon: '✓', title: 'Premium Football Tips', desc: 'Get daily 3+ odds, 5+ odds, and 15+ odds betting tips with guaranteed odds ranging from 3-15x returns.' },
              { bg: '#dbeafe', iconColor: '#3b82f6', icon: '$', title: 'Jackpot Predictions', desc: 'Expert SportPesa Mega Jackpot and Betika Midweek Jackpot predictions to maximize your chances.' },
              { bg: '#fef3c7', iconColor: '#f59e0b', icon: '📊', title: 'Betting Strategies', desc: 'Learn winning strategies, bankroll management, and market analysis through our resources.' },
              { bg: '#e0e7ff', iconColor: '#6366f1', icon: '⏱', title: 'Instant SMS Delivery', desc: 'Get your purchased tips delivered instantly via SMS. Never miss a winning opportunity.' },
            ].map((f, i) => (
              <div key={i}>
                <div style={{ width: '48px', height: '48px', backgroundColor: f.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: f.iconColor, fontSize: '1.5rem' }}>{f.icon}</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to={user ? "/subscribe" : "/register"} style={{ display: 'inline-block', padding: '14px 40px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '1rem' }}>
              Get Started — It's Free →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
