import { useState } from "react";
import "./Home.css";
import PremiumTipCard from "../../components/premium/PremiumTipCard";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {

     const [activeDay, setActiveDay] = useState<"yesterday" | "today" | "tomorrow">("today");
     const [openPlan, setOpenPlan] = useState<string | null>(null);
     const [wonTipsFilter, setWonTipsFilter] = useState<"yesterday" | "today" | "week">("today");

     const { userPlan } = useAuth();

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
          <button className="btn-primary">View Free Tips</button>
          <button className="btn-outline">Subscribe Now</button>
        </div>
      </section>

   <section className="section">
  <div className="section-header">
    <h2 className="section-title">Free Guaranteed Tips</h2>
  </div>

  {/* Tabs always visible */}
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
</section>



      <section className="section">
  <h2 className="section-title">Today's Premium Tips</h2>

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
      userPlan="NONE"
    />

    <PremiumTipCard
      league="UCL"
      fixture="PSG vs Bayern"
      tip="Home Win"
      odds="2.10"
      level="PLATINUM"
      userPlan="NONE"
    />
  </div>
</section>


   {/* PREMIUM PLANS */}
<section className="section dark">
  <h2 className="section-title" style={{color: '#10b981', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem'}}>Premium Tips</h2>

  <div className="plans" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto'}}>
    {/* Silver Plan */}
    <div style={{
      backgroundColor: '#1a2332',
      borderRadius: '12px',
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
        <span style={{
          backgroundColor: '#d1fae5',
          color: '#065f46',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>Silver Plan</span>
        <div style={{color: '#fbbf24', fontSize: '1.25rem'}}>⭐⭐⭐⭐⭐</div>
      </div>
      <p style={{color: '#e5e7eb', marginBottom: '1.5rem', lineHeight: '1.6'}}>
        Get sure 3-5 odds daily and earn consistently. Click BUY to purchase our Silver plan now. Tips are sent instantly via SMS.
      </p>
      <button style={{
        backgroundColor: '#10b981',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer'
      }}>BUY @KSH. 50</button>
    </div>

    {/* Gold Plan */}
    <div style={{
      backgroundColor: '#1a2332',
      borderRadius: '12px',
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
        <span style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>Gold Plan</span>
        <div style={{color: '#fbbf24', fontSize: '1.25rem'}}>⭐⭐⭐⭐✨</div>
      </div>
      <p style={{color: '#e5e7eb', marginBottom: '1.5rem', lineHeight: '1.6'}}>
        Get sure 5-7 odds daily and earn consistently. Click BUY to purchase our Gold plan now. Tips are sent instantly via SMS.
      </p>
      <button style={{
        backgroundColor: '#10b981',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer'
      }}>BUY @KSH. 70</button>
    </div>

    {/* Platinum Plan */}
    <div style={{
      backgroundColor: '#1a2332',
      borderRadius: '12px',
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
        <span style={{
          backgroundColor: '#e0e7ff',
          color: '#3730a3',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>Platinum Plan</span>
        <div style={{color: '#fbbf24', fontSize: '1.25rem'}}>⭐⭐⭐⭐☆</div>
      </div>
      <p style={{color: '#e5e7eb', marginBottom: '1.5rem', lineHeight: '1.6'}}>
        Get sure 8-15 odds daily and earn consistently. Click BUY to purchase our Platinum plan now. Tips are sent instantly via SMS.
      </p>
      <button style={{
        backgroundColor: '#10b981',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer'
      }}>BUY @KSH. 100</button>
    </div>
  </div>
</section>

    <section className="section">
  <h2 className="section-title">Value Bets</h2>

  <div className="value-bets">
    <Link to="/value-bets/sportpesa" className="value-card">
      SportPesa Jackpot
    </Link>

    <Link to="/value-bets/betika" className="value-card">
      Betika Jackpot
    </Link>

    <Link to="/value-bets/correct-score" className="value-card">
      Correct Score
    </Link>

    <Link to="/value-bets/goal-range" className="value-card">
      Goal Range
    </Link>
  </div>
</section>

{/* RECENTLY WON PREMIUM TIPS */}
<section className="section" style={{backgroundColor: '#f3f4f6', padding: '3rem 1rem'}}>
  <div style={{ 
    backgroundColor: 'white', 
    maxWidth: '900px', 
    margin: '0 auto', 
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <h2 style={{ 
      color: '#10b981', 
      fontSize: '2rem', 
      fontWeight: 'bold', 
      textAlign: 'center',
      marginBottom: '1rem' 
    }}>
      Recently Won Premium Tips
    </h2>

    {/* Filter Tabs */}
    <div className="filters" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
      <button
        className={wonTipsFilter === "yesterday" ? "active" : ""}
        onClick={() => setWonTipsFilter("yesterday")}
        style={{
          padding: '0.5rem 1.5rem',
          borderRadius: '8px',
          border: wonTipsFilter === "yesterday" ? '2px solid #10b981' : '2px solid #e5e7eb',
          backgroundColor: wonTipsFilter === "yesterday" ? '#10b981' : 'white',
          color: wonTipsFilter === "yesterday" ? 'white' : '#6b7280',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          transition: 'all 0.2s'
        }}
      >
        Yesterday
      </button>

      <button
        className={wonTipsFilter === "today" ? "active" : ""}
        onClick={() => setWonTipsFilter("today")}
        style={{
          padding: '0.5rem 1.5rem',
          borderRadius: '8px',
          border: wonTipsFilter === "today" ? '2px solid #10b981' : '2px solid #e5e7eb',
          backgroundColor: wonTipsFilter === "today" ? '#10b981' : 'white',
          color: wonTipsFilter === "today" ? 'white' : '#6b7280',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          transition: 'all 0.2s'
        }}
      >
        Today
      </button>

      <button
        className={wonTipsFilter === "week" ? "active" : ""}
        onClick={() => setWonTipsFilter("week")}
        style={{
          padding: '0.5rem 1.5rem',
          borderRadius: '8px',
          border: wonTipsFilter === "week" ? '2px solid #10b981' : '2px solid #e5e7eb',
          backgroundColor: wonTipsFilter === "week" ? '#10b981' : 'white',
          color: wonTipsFilter === "week" ? 'white' : '#6b7280',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.875rem',
          transition: 'all 0.2s'
        }}
      >
        This Week
      </button>
    </div>

    {/* Silver Plan Accordion */}
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={() => togglePlan('silver')}
        style={{
          width: '100%',
          backgroundColor: '#f9fafb',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}
      >
        <span>Silver Plan</span>
        <span style={{ fontSize: '1.5rem' }}>{openPlan === 'silver' ? '▼' : '▶'}</span>
      </button>
      {openPlan === 'silver' && (
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f9fafb', 
          marginTop: '0.5rem',
          borderRadius: '8px' 
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            {wonTipsFilter === 'yesterday' && 'Yesterday\'s winning Silver plan tips'}
            {wonTipsFilter === 'today' && 'Today\'s winning Silver plan tips'}
            {wonTipsFilter === 'week' && 'This week\'s winning Silver plan tips'}
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
              <tr>
                <td style={{ padding: '0.5rem' }}>EPL</td>
                <td style={{ padding: '0.5rem' }}>Arsenal vs Liverpool</td>
                <td style={{ padding: '0.5rem' }}>Over 2.5</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Won</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Gold Plan Accordion */}
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={() => togglePlan('gold')}
        style={{
          width: '100%',
          backgroundColor: '#f9fafb',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}
      >
        <span>Gold Plan</span>
        <span style={{ fontSize: '1.5rem' }}>{openPlan === 'gold' ? '▼' : '▶'}</span>
      </button>
      {openPlan === 'gold' && (
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f9fafb', 
          marginTop: '0.5rem',
          borderRadius: '8px' 
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            {wonTipsFilter === 'yesterday' && 'Yesterday\'s winning Gold plan tips'}
            {wonTipsFilter === 'today' && 'Today\'s winning Gold plan tips'}
            {wonTipsFilter === 'week' && 'This week\'s winning Gold plan tips'}
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
              <tr>
                <td style={{ padding: '0.5rem' }}>La Liga</td>
                <td style={{ padding: '0.5rem' }}>Barcelona vs Madrid</td>
                <td style={{ padding: '0.5rem' }}>BTTS</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Won</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Platinum Plan Accordion */}
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={() => togglePlan('platinum')}
        style={{
          width: '100%',
          backgroundColor: '#f9fafb',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}
      >
        <span>Platinum Plan</span>
        <span style={{ fontSize: '1.5rem' }}>{openPlan === 'platinum' ? '▼' : '▶'}</span>
      </button>
      {openPlan === 'platinum' && (
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f9fafb', 
          marginTop: '0.5rem',
          borderRadius: '8px' 
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            {wonTipsFilter === 'yesterday' && 'Yesterday\'s winning Platinum plan tips'}
            {wonTipsFilter === 'today' && 'Today\'s winning Platinum plan tips'}
            {wonTipsFilter === 'week' && 'This week\'s winning Platinum plan tips'}
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
              <tr>
                <td style={{ padding: '0.5rem' }}>UCL</td>
                <td style={{ padding: '0.5rem' }}>Bayern vs PSG</td>
                <td style={{ padding: '0.5rem' }}>Home Win</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Won</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
</section>

{/* WHY CHOOSE US */}
<section className="section" style={{backgroundColor: '#ffffff', padding: '3rem 1rem'}}>
  <div style={{ 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '2rem'
  }}>
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ 
        color: '#10b981', 
        fontSize: '0.875rem', 
        fontWeight: '600', 
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem'
      }}>
        WHY CHOOSE US
      </p>
      <h2 style={{ 
        color: '#10b981', 
        fontSize: '2rem', 
        fontWeight: 'bold',
        marginBottom: '1rem',
        lineHeight: '1.3'
      }}>
        Best Football Predictions & Betting Tips in Kenya | Expert Analysis Daily
      </h2>
      <p style={{ 
        color: '#4b5563', 
        fontSize: '1rem',
        lineHeight: '1.7',
        marginBottom: '2.5rem'
      }}>
        Get accurate football betting predictions from Kenya's leading tipsters. We deliver data-driven analysis, sure odds, and winning strategies for Premier League, Champions League, Kenyan Premier League, and 40+ international leagues. Join thousands of successful bettors who trust our 90%+ accuracy rate for daily betting tips, jackpot predictions, and expert picks.
      </p>
    </div>

    {/* Features Grid */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem'
    }}>
      {/* Premium Football Tips */}
      <div>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: '#d1fae5', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ color: '#10b981', fontSize: '1.5rem' }}>✓</span>
        </div>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          color: '#111827'
        }}>
          Premium Football Tips
        </h3>
        <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '0.5rem' }}>
          Get daily <span style={{ color: '#10b981', fontWeight: '600' }}>3+ odds</span>, <span style={{ color: '#10b981', fontWeight: '600' }}>5+ odds</span>, and <span style={{ color: '#10b981', fontWeight: '600' }}>15+ odds</span> betting tips with guaranteed odds ranging from 3-15x returns on your investment.
        </p>
      </div>

      {/* Jackpot Predictions */}
      <div>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ color: '#3b82f6', fontSize: '1.5rem' }}>$</span>
        </div>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          color: '#111827'
        }}>
          Jackpot Predictions
        </h3>
        <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '0.5rem' }}>
          Expert <span style={{ color: '#10b981', fontWeight: '600' }}>SportPesa Mega Jackpot</span> and <span style={{ color: '#10b981', fontWeight: '600' }}>Betika Midweek Jackpot</span> predictions with detailed analysis to maximize your chances of winning millions.
        </p>
      </div>

      {/* Betting Strategies */}
      <div>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: '#fef3c7', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ color: '#f59e0b', fontSize: '1.5rem' }}>📊</span>
        </div>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          color: '#111827'
        }}>
          Betting Strategies & Education
        </h3>
        <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '0.5rem' }}>
          Learn winning betting strategies, bankroll management, and market analysis through our comprehensive <span style={{ color: '#10b981', fontWeight: '600' }}>betting blog</span> and educational resources.
        </p>
      </div>

      {/* Instant SMS Delivery */}
      <div>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          backgroundColor: '#e0e7ff', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ color: '#6366f1', fontSize: '1.5rem' }}>⏱</span>
        </div>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          color: '#111827'
        }}>
          Instant SMS Delivery
        </h3>
        <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '0.5rem' }}>
          Get your purchased tips delivered instantly via SMS to your phone. Never miss a winning opportunity with our fast and reliable tip delivery system.
        </p>
      </div>
    </div>
  </div>
</section>

    </main>
  );
};

export default Home;