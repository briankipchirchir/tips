import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/admin.css';

const ValueBets = () => {
  const valueBets = [
    {
      id: 1,
      league: 'EPL',
      fixture: 'Man City vs Liverpool',
      bet: 'Over 2.5 Goals',
      bookmakerOdds: 1.85,
      fairOdds: 1.65,
      valuePercent: 12.1,
      status: 'Active',
    },
    {
      id: 2,
      league: 'La Liga',
      fixture: 'Barcelona vs Atletico',
      bet: 'Home Win',
      bookmakerOdds: 2.10,
      fairOdds: 1.85,
      valuePercent: 13.5,
      status: 'Active',
    },
    {
      id: 3,
      league: 'Serie A',
      fixture: 'Juventus vs Roma',
      bet: 'BTTS',
      bookmakerOdds: 1.90,
      fairOdds: 1.75,
      valuePercent: 8.6,
      status: 'Completed',
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="dashboard-header">
          <h1>Value Bets</h1>
          <button className="btn-primary">+ Add Value Bet</button>
        </div>

        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stats-card">
            <p className="stats-title">Active Value Bets</p>
            <h3 className="stats-value">
              {valueBets.filter(v => v.status === 'Active').length}
            </h3>
          </div>
          <div className="stats-card">
            <p className="stats-title">Avg Value %</p>
            <h3 className="stats-value">
              {(
                valueBets.reduce((sum, v) => sum + v.valuePercent, 0) / valueBets.length
              ).toFixed(1)}
              %
            </h3>
          </div>
          <div className="stats-card">
            <p className="stats-title">Win Rate</p>
            <h3 className="stats-value">67%</h3>
          </div>
        </div>

        <div className="admin-section">
          <h2>Value Bets Analysis</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>League</th>
                <th>Fixture</th>
                <th>Bet</th>
                <th>Bookmaker Odds</th>
                <th>Fair Odds</th>
                <th>Value %</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {valueBets.map((vb) => (
                <tr key={vb.id}>
                  <td>{vb.league}</td>
                  <td>{vb.fixture}</td>
                  <td>{vb.bet}</td>
                  <td>{vb.bookmakerOdds.toFixed(2)}</td>
                  <td>{vb.fairOdds.toFixed(2)}</td>
                  <td>
                    <span className="value-percentage">+{vb.valuePercent.toFixed(1)}%</span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${
                        vb.status === 'Active' ? 'pending' : 'completed'
                      }`}
                    >
                      {vb.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="admin-section" style={{ marginTop: '2rem' }}>
          <h2>Value Bet Calculator</h2>
          <div className="calculator-card">
            <form className="value-calculator">
              <div className="form-group">
                <label>Bookmaker Odds:</label>
                <input type="number" step="0.01" placeholder="e.g., 2.10" />
              </div>
              <div className="form-group">
                <label>Fair Odds (Your Estimate):</label>
                <input type="number" step="0.01" placeholder="e.g., 1.85" />
              </div>
              <button type="button" className="btn-primary">
                Calculate Value
              </button>
              <div className="calculator-result">
                <p>Value: <strong>--</strong></p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ValueBets;