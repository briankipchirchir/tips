import { useState, useEffect } from "react";
import "./Home.css";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { tipsApi } from "../../services/api";
import GoalBg from "../../assets/Goal.png";

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
  const [wonTipsFilter, setWonTipsFilter] = useState<"yesterday" | "today" | "week">("yesterday");
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

  useEffect(() => {
    setTipsLoading(true);
    tipsApi.getFreeTips(getDate(activeDay))
      .then((res) => setFreeTips(res.data))
      .catch(() => setFreeTips([]))
      .finally(() => setTipsLoading(false));
  }, [activeDay]);

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

  const [wonTips, setWonTips] = useState<Record<string, Tip[]>>({ silver: [], gold: [], platinum: [] });
  const [wonTipsLoading, setWonTipsLoading] = useState(false);

  useEffect(() => {
    setWonTipsLoading(true);
    setOpenPlan("silver");
    tipsApi.getWonTips(wonTipsFilter)
      .then((res) => {
        const grouped: Record<string, Tip[]> = { silver: [], gold: [], platinum: [] };
        res.data.forEach((tip: Tip) => {
          const key = tip.level.toLowerCase();
          if (grouped[key]) grouped[key].push(tip);
        });
        setWonTips(grouped);
      })
      .catch(() => setWonTips({ silver: [], gold: [], platinum: [] }))
      .finally(() => setWonTipsLoading(false));
  }, [wonTipsFilter]);

  return (
    <main className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${GoalBg})` }} />
        <div className="hero-pitch" />

        <div className="hero-alert">
          ⚡ Limited Winning Tips — Updated Daily
        </div>

        <p className="hero-tag">Welcome to BetTips</p>

        <h1>
          Your Ultimate Source for<br />
          <span>Accurate Football</span> Predictions
        </h1>

        <p className="hero-sub">
          Expert analysis, reliable tips, and daily winning strategies — delivered straight to you.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">94%</div>
            <div className="hero-stat-label">Win Rate</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">40+</div>
            <div className="hero-stat-label">Leagues</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">5K+</div>
            <div className="hero-stat-label">Members</div>
          </div>
        </div>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/free-tips")}>
            View Free Tips
          </button>
          <button className="btn-outline" onClick={() => navigate("/subscribe")}>
            Subscribe Now
          </button>
        </div>
      </section>

      {/* ── RECENTLY WON PREMIUM TIPS ── */}
      <div className="won-wrapper">
        <div className="won-inner">
          <h2 className="won-title">Recently Won Premium Tips</h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div className="filters">
              {(['yesterday', 'today', 'week'] as const).map((f) => (
                <button
                  key={f}
                  className={wonTipsFilter === f ? "active" : ""}
                  onClick={() => setWonTipsFilter(f)}
                >
                  {f === 'week' ? 'This Week' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {wonTipsLoading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '1rem' }}>Loading...</p>
          ) : (
            [
              { key: 'silver', label: 'Silver Plan' },
              { key: 'gold',   label: 'Gold Plan' },
              { key: 'platinum', label: 'Platinum Plan' },
            ].map(({ key, label }) => (
              <div key={key} className="accordion-item">
                <button className="accordion-btn" onClick={() => togglePlan(key)}>
                  <span>{label}</span>
                  <span style={{ fontSize: '1.1rem', color: 'var(--green)' }}>
                    {openPlan === key ? '▾' : '▸'}
                  </span>
                </button>
                {openPlan === key && (
                  <div className="accordion-body">
                    <p style={{ color: 'var(--text-dim)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                      {wonTipsFilter === 'yesterday' && `Yesterday's winning ${label} tips`}
                      {wonTipsFilter === 'today'     && `Today's winning ${label} tips`}
                      {wonTipsFilter === 'week'      && `This week's winning ${label} tips`}
                    </p>
                    {wonTips[key].length === 0 ? (
                      <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '1rem' }}>
                        No won tips for this period.
                      </p>
                    ) : (
                      <table className="tips-table">
                        <thead>
                          <tr>
                            <th>League</th><th>Match</th><th>Tip</th><th style={{ textAlign: 'center' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wonTips[key].map((tip) => (
                            <tr key={tip.id}>
                              <td>{tip.league}</td>
                              <td>{tip.fixture}</td>
                              <td>{tip.prediction}</td>
                              <td style={{ textAlign: 'center' }}>
                                <span style={{ color: '#10b981', fontWeight: '700' }}>✓ Won</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/premium-tips" className="cta-link">
              View Today's Premium Tips →
            </Link>
          </div>
        </div>
      </div>

      {/* ── FREE TIPS PREVIEW ── */}
      <section className="section" id="free-tips">
        <div className="section-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Free Guaranteed Tips</h2>
          <Link to="/free-tips" className="filter-btn" style={{ textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        <div className="filters" style={{ margin: '24px 0' }}>
          {(["yesterday", "today", "tomorrow"] as const).map((d) => (
            <button key={d} className={activeDay === d ? "active" : ""} onClick={() => setActiveDay(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {tipsLoading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>Loading tips...</p>
        ) : freeTips.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>
            No free tips available for this day yet.
          </p>
        ) : (
          <div style={{ background: 'var(--navy-light)', borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            <table className="tips-table">
              <thead>
                <tr>
                  <th>Time</th><th>League</th><th>Fixture</th><th>Tip</th>
                </tr>
              </thead>
              <tbody>
                {freeTips.map((tip) => (
                  <tr key={tip.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{tip.kickoffTime}</td>
                    <td className="league">{tip.league}</td>
                    <td className="fixture">{tip.fixture}</td>
                    <td className="tip">{tip.prediction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/free-tips" className="cta-link outline">
            See All Free Tips →
          </Link>
        </div>
      </section>

      {/* ── TODAY'S PREMIUM TIPS PREVIEW ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Today's Premium Tips</h2>
          <Link to="/premium-tips" className="filter-btn" style={{ textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {premiumTips.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px', marginTop: '16px' }}>
            No premium tips posted yet today.
          </p>
        ) : (
          <div className="plans" style={{ marginTop: '24px' }}>
            {premiumTips.map((tip) => (
              <div
                key={tip.id}
                className="premium-card glow-card"
                style={{ border: `1px solid ${LEVEL_COLOR[tip.level] || 'var(--glass-border)'}22` }}
              >
                <span className="hot-badge">🔥 HOT</span>
                <span className={`plan-badge ${tip.level}`}>{tip.level}</span>

                {(userPlan === "NONE" ||
                  (tip.level === "GOLD" && userPlan === "SILVER") ||
                  (tip.level === "PLATINUM" && userPlan !== "PLATINUM")) ? (
                  <div className="blurred">
                    <p className="league">{tip.league}</p>
                    <p className="fixture">{tip.fixture}</p>
                    <p className="tip">Tip: {tip.prediction}</p>
                    <p className="odds">Odds: {tip.odds}</p>
                  </div>
                ) : (
                  <>
                    <p className="league">{tip.league}</p>
                    <p className="fixture">{tip.fixture}</p>
                    <p className="tip">Tip: {tip.prediction}</p>
                    <p className="odds">Odds: {tip.odds}</p>
                  </>
                )}

                {userPlan === "NONE" && (
                  <div className="overlay">
                    <p>🔒 Premium Tip</p>
                    <button onClick={() => navigate('/subscribe')}>Subscribe to Unlock</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/premium-tips" className="cta-link outline">
            View All Premium Tips →
          </Link>
        </div>
      </section>

      {/* ── PREMIUM PLANS ── */}
      <section className="section dark" id="premium-plans">
        <h2 className="section-title" style={{ fontSize: '2.8rem' }}>Premium Plans</h2>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {[
            {
              key: 'silver', chip: 'silver', label: 'Silver Plan',
              stars: '⭐⭐⭐⭐⭐',
              desc: 'Get sure 3–5 odds daily and earn consistently. Tips are sent instantly via SMS.',
              price: 'KSH. 50',
            },
            {
              key: 'gold', chip: 'gold', label: 'Gold Plan',
              stars: '⭐⭐⭐⭐✨',
              desc: 'Get sure 5–7 odds daily and earn consistently. Tips are sent instantly via SMS.',
              price: 'KSH. 70',
            },
            {
              key: 'platinum', chip: 'platinum', label: 'Platinum Plan',
              stars: '⭐⭐⭐⭐☆',
              desc: 'Get sure 8–15 odds daily and earn consistently. Tips are sent instantly via SMS.',
              price: 'KSH. 100',
            },
          ].map((plan) => (
            <div key={plan.key} className="plan-row">
              <div className="plan-row-top">
                <span className={`plan-chip ${plan.chip}`}>{plan.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>{plan.stars}</span>
                  <span className="plan-price">{plan.price}</span>
                </div>
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <button className="plan-buy-btn" onClick={() => navigate("/subscribe")}>
                BUY @ {plan.price}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/subscribe" className="cta-link">
            See All Plans & Durations →
          </Link>
        </div>
      </section>

      {/* ── VALUE BETS ── */}
      <section className="section">
        <h2 className="section-title">Value Bets</h2>
        <div className="value-bets">
          <Link to="/value-bets/sportpesa"    className="value-card">🏆 SportPesa Jackpot</Link>
          <Link to="/value-bets/betika"       className="value-card">💎 Betika Jackpot</Link>
          <Link to="/value-bets/correct-score" className="value-card">🎯 Correct Score</Link>
          <Link to="/value-bets/goal-range"   className="value-card">⚽ Goal Range</Link>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <div className="why-wrapper">
        <div className="why-inner">
          <p className="why-eyebrow">Why Choose Us</p>
          <h2 className="why-heading">
            Best Football Predictions &amp;<br />Betting Tips in Kenya
          </h2>
          <p className="why-desc">
            Get accurate football betting predictions from Kenya's leading tipsters. We deliver data-driven analysis, sure odds, and winning strategies for Premier League, Champions League, Kenyan Premier League, and 40+ international leagues.
          </p>

          <div className="why-grid">
            {[
              {
                bg: 'rgba(16,185,129,0.1)', iconColor: '#10b981', icon: '✓',
                title: 'Premium Football Tips',
                desc: 'Get daily 3+ odds, 5+ odds, and 15+ odds betting tips with guaranteed odds ranging from 3–15x returns.',
              },
              {
                bg: 'rgba(59,130,246,0.1)', iconColor: '#3b82f6', icon: '$',
                title: 'Jackpot Predictions',
                desc: 'Expert SportPesa Mega Jackpot and Betika Midweek Jackpot predictions to maximise your chances.',
              },
              {
                bg: 'rgba(245,158,11,0.1)', iconColor: '#f59e0b', icon: '📊',
                title: 'Betting Strategies',
                desc: 'Learn winning strategies, bankroll management, and market analysis through our resources.',
              },
              {
                bg: 'rgba(99,102,241,0.1)', iconColor: '#6366f1', icon: '⏱',
                title: 'Instant SMS Delivery',
                desc: 'Get your purchased tips delivered instantly via SMS. Never miss a winning opportunity.',
              },
            ].map((f, i) => (
              <div key={i} className="why-card">
                <div className="why-icon" style={{ background: f.bg }}>
                  <span style={{ color: f.iconColor, fontSize: '1.3rem' }}>{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to={user ? "/subscribe" : "/register"} className="cta-link">
              Get Started — It's Free →
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
};

export default Home;