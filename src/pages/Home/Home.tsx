import { useState } from "react";
import "./Home.css";
import PremiumTipCard from "../../components/premium/PremiumTipCard";
import { useAuth } from "../../context/AuthContext";

const Home = () => {

     const [showFilters, setShowFilters] = useState(false);

     const { userPlan } = useAuth();

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

      {/* FREE TIPS */}
   <section className="section">
        <div className="section-header">
          <h2 className="section-title">Free Guaranteed Tips</h2>
          <button
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters">
            <button>Yesterday</button>
            <button>Today</button>
            <button>Tomorrow</button>
          </div>
        )}

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
            <tr>
              <td>18:00</td>
              <td>EPL</td>
              <td>Man City vs Wolves</td>
              <td>Over 2.5</td>
            </tr>
          </tbody>
        </table>
      </section>


      <section className="section">
  <h2 className="section-title">Today’s Premium Tips</h2>

  <div className="plans">
    <PremiumTipCard
      league="EPL"
      fixture="Arsenal vs Chelsea"
      tip="Over 2.5"
      odds="1.85"
      level="GOLD"
      userPlan="NONE"
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
        <h2 className="section-title">Premium Tips</h2>

        <div className="plans">
          <div className="plan-card">
            <h3>Silver Plan</h3>
            <p>3–5 odds daily</p>
            <button>KSH 50</button>
          </div>

          <div className="plan-card">
            <h3>Gold Plan</h3>
            <p>5–7 odds daily</p>
            <button>KSH 70</button>
          </div>

          <div className="plan-card">
            <h3>Platinum Plan</h3>
            <p>8–15 odds daily</p>
            <button>KSH 100</button>
          </div>
        </div>
      </section>

      {/* VALUE BETS */}
      <section className="section">
        <h2 className="section-title">Value Bets</h2>

        <div className="value-bets">
          <div className="value-card">SportPesa Jackpot</div>
          <div className="value-card">Betika Jackpot</div>
          <div className="value-card">Correct Score</div>
          <div className="value-card">Goal Range</div>
        </div>
      </section>
    </main>
  );
};

export default Home;
