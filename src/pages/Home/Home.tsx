import { useState } from "react";
import "./Home.css";
import PremiumTipCard from "../../components/premium/PremiumTipCard";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [activeDay, setActiveDay] = useState<"yesterday" | "today" | "tomorrow">("today");
  const [openPlan, setOpenPlan] = useState<string | null>(null);
  const [wonTipsFilter, setWonTipsFilter] = useState<"yesterday" | "today" | "week">("today");

  const { userPlan } = useAuth();
  const navigate = useNavigate();

  const togglePlan = (plan: string) => {
    setOpenPlan(openPlan === plan ? null : plan);
  };

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <p className="hero-tag">Welcome to BetTips</p>
        <h1>Your Ultimate Source for Accurate Football Predictions</h1>
        <p className="hero-sub">
          Expert analysis, reliable tips, and daily winning strategies.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/free-tips")}>
            View Free Tips
          </button>
          <button className="btn-outline" onClick={() => navigate("/subscribe")}>
            Subscribe Now
          </button>
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
          <button
            className={activeDay === "yesterday" ? "active" : ""}
            onClick={() => setActiveDay("yesterday")}
          >
            Yesterday
          </button>
          <button
            className={activeDay === "today" ? "active" : ""}
            onClick={() => setActiveDay("today")}
          >
            Today
          </button>
          <button
            className={activeDay === "tomorrow" ? "active" : ""}
            onClick={() => setActiveDay("tomorrow")}
          >
            Tomorrow
          </button>
        </div>

        <table className="tips-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>League</th>
              <th>Fixture</th>
              <th>Tip</th>
            </tr>
          </thead>
          <tbody>
            {activeDay === "today" && (
              <tr>
                <td>18:00</td>
                <td>EPL</td>
                <td>Man City vs Wolves</td>
                <td>Over 2.5</td>
              </tr>
            )}
            {activeDay === "yesterday" && (
              <tr>
                <td>20:00</td>
                <td>La Liga</td>
                <td>Barcelona vs Sevilla</td>
                <td>BTTS</td>
              </tr>
            )}
            {activeDay === "tomorrow" && (
              <tr>
                <td>19:30</td>
                <td>Serie A</td>
                <td>Inter vs Roma</td>
                <td>Home Win</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/free-tips"
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              background: 'transparent',
              border: '1.5px solid #22c55e',
              color: '#22c55e',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
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

        <div className="plans">
          <PremiumTipCard
            league="EPL"
            fixture="Arsenal vs Chelsea"
            tip="Over 2.5"
            odds="1.85"
            level="GOLD"
            userPlan={userPlan}
          />
          <PremiumTipCard
            league="Serie A"
            fixture="Inter vs Milan"
            tip="BTTS"
            odds="1.72"
            level="SILVER"
            userPlan={userPlan}
          />
          <PremiumTipCard
            league="UCL"
            fixture="PSG vs Bayern"
            tip="Home Win"
            odds="2.10"
            level="PLATINUM"
            userPlan={userPlan}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            to="/premium-tips"
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              background: 'transparent',
              border: '1.5px solid #22c55e',
              color: '#22c55e',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            View All Premium Tips →
          </Link>
        </div>
      </section>

      {/* PREMIUM PLANS */}
      <section className="section dark" id="premium-plans">
        <h2 className="section-title" style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Premium Plans
        </h2>

        <div className="plans" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {/* Silver Plan */}
          <div style={{ backgroundColor: '#1a2332', borderRadius: '12px', padding: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>
                Silver Plan
              </span>
              <div style={{ color: '#fbbf24', fontSize: '1.25rem' }}>⭐⭐⭐⭐⭐</div>
            </div>
            <p style={{ color: '#e5e7eb', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Get sure 3-5 odds daily and earn consistently. Tips are sent instantly via SMS.
            </p>
            <button
              onClick={() => navigate("/subscribe")}
              style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
            >
              BUY @KSH. 50
            </button>
          </div>

          {/* Gold Plan */}
          <div style={{ backgroundColor: '#1a2332', borderRadius: '12px', padding: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>
                Gold Plan
              </span>
              <div style={{ color: '#fbbf24', fontSize: '1.25rem' }}>⭐⭐⭐⭐✨</div>
            </div>
            <p style={{ color: '#e5e7eb', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Get sure 5-7 odds daily and earn consistently. Tips are sent instantly via SMS.
            </p>
            <button
              onClick={() => navigate("/subscribe")}
              style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
            >
              BUY @KSH. 70
            </button>
          </div>

          {/* Platinum Plan */}
          <div style={{ backgroundColor: '#1a2332', borderRadius: '12px', padding: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>
                Platinum Plan
              </span>
              <div style={{ color: '#fbbf24', fontSize: '1.25rem' }}>⭐⭐⭐⭐☆</div>
            </div>
            <p style={{ color: '#e5e7eb', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Get sure 8-15 odds daily and earn consistently. Tips are sent instantly via SMS.
            </p>
            <button
              onClick={() => navigate("/subscribe")}
              style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
            >
              BUY @KSH. 100
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            to="/subscribe"
            style={{
              display: 'inline-block',
              padding: '12px 36px',
              background: '#10b981',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
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
              <button
                key={f}
                className={wonTipsFilter === f ? "active" : ""}
                onClick={() => setWonTipsFilter(f)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  border: wonTipsFilter === f ? '2px solid #10b981' : '2px solid #e5e7eb',
                  backgroundColor: wonTipsFilter === f ? '#10b981' : 'white',
                  color: wonTipsFilter === f ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
              >
                {f === 'week' ? 'This Week' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Accordions */}
          {[
            {
              key: 'silver', label: 'Silver Plan',
              rows: [{ league: 'EPL', match: 'Arsenal vs Liverpool', tip: 'Over 2.5' }],
            },
            {
              key: 'gold', label: 'Gold Plan',
              rows: [{ league: 'La Liga', match: 'Barcelona vs Madrid', tip: 'BTTS' }],
            },
            {
              key: 'platinum', label: 'Platinum Plan',
              rows: [{ league: 'UCL', match: 'Bayern vs PSG', tip: 'Home Win' }],
            },
          ].map(({ key, label, rows }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => togglePlan(key)}
                style={{ width: '100%', backgroundColor: '#f9fafb', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.125rem', fontWeight: '600' }}
              >
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
            <Link
              to="/premium-tips"
              style={{ display: 'inline-block', padding: '10px 28px', background: '#10b981', color: 'white', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}
            >
              View Today's Premium Tips →
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section" style={{ backgroundColor: '#ffffff', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              WHY CHOOSE US
            </p>
            <h2 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.3' }}>
              Best Football Predictions & Betting Tips in Kenya | Expert Analysis Daily
            </h2>
            <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
              Get accurate football betting predictions from Kenya's leading tipsters. We deliver data-driven analysis, sure odds, and winning strategies for Premier League, Champions League, Kenyan Premier League, and 40+ international leagues. Join thousands of successful bettors who trust our 90%+ accuracy rate for daily betting tips, jackpot predictions, and expert picks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { bg: '#d1fae5', iconColor: '#10b981', icon: '✓', title: 'Premium Football Tips', desc: <>Get daily <b style={{color:'#10b981'}}>3+ odds</b>, <b style={{color:'#10b981'}}>5+ odds</b>, and <b style={{color:'#10b981'}}>15+ odds</b> betting tips with guaranteed odds ranging from 3-15x returns.</> },
              { bg: '#dbeafe', iconColor: '#3b82f6', icon: '$', title: 'Jackpot Predictions', desc: <>Expert <b style={{color:'#10b981'}}>SportPesa Mega Jackpot</b> and <b style={{color:'#10b981'}}>Betika Midweek Jackpot</b> predictions to maximize your chances of winning millions.</> },
              { bg: '#fef3c7', iconColor: '#f59e0b', icon: '📊', title: 'Betting Strategies & Education', desc: <>Learn winning strategies, bankroll management, and market analysis through our comprehensive <b style={{color:'#10b981'}}>betting blog</b>.</> },
              { bg: '#e0e7ff', iconColor: '#6366f1', icon: '⏱', title: 'Instant SMS Delivery', desc: 'Get your purchased tips delivered instantly via SMS. Never miss a winning opportunity with our fast and reliable delivery system.' },
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
            <Link
              to="/register"
              style={{ display: 'inline-block', padding: '14px 40px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '1rem' }}
            >
              Get Started — It's Free →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
