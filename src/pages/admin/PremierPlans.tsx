import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/admin.css';

const PremiumPlans = () => {
  const plans = [
    {
      id: 1,
      name: 'BRONZE',
      price: 50,
      duration: '1 Week',
      features: ['Basic Tips', 'Email Support'],
      active: true,
    },
    {
      id: 2,
      name: 'SILVER',
      price: 150,
      duration: '1 Month',
      features: ['Premium Tips', 'Priority Support', 'Value Bets'],
      active: true,
    },
    {
      id: 3,
      name: 'GOLD',
      price: 400,
      duration: '3 Months',
      features: ['All Premium Features', '24/7 Support', 'VIP Tips', 'Exclusive Analysis'],
      active: true,
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="dashboard-header">
          <h1>Premium Plans</h1>
          <button className="btn-primary">+ Add New Plan</button>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">KSH</span>
                  <span className="amount">{plan.price}</span>
                  <span className="duration">/{plan.duration}</span>
                </div>
              </div>

              <div className="plan-features">
                <h4>Features:</h4>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="plan-status">
                <span className={`badge badge-${plan.active ? 'completed' : 'pending'}`}>
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="plan-actions">
                <button className="btn-edit">Edit Plan</button>
                <button className="btn-delete">
                  {plan.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <section className="admin-section" style={{ marginTop: '2rem' }}>
          <h2>Plan Statistics</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Active Subscribers</th>
                <th>Monthly Revenue</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BRONZE</td>
                <td>45</td>
                <td>KSH 2,250</td>
                <td>12%</td>
              </tr>
              <tr>
                <td>SILVER</td>
                <td>78</td>
                <td>KSH 11,700</td>
                <td>18%</td>
              </tr>
              <tr>
                <td>GOLD</td>
                <td>34</td>
                <td>KSH 13,600</td>
                <td>8%</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default PremiumPlans;