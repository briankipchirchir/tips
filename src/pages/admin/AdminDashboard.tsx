import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import TipsTable from '../../components/admin/TipsTable';
import TipModal from '../../components/admin/TipModal'
import '../../styles/admin.css';
import { useTips } from '../../context/TipsCotext';
import { useUsers } from '../../context/UserContext';
import { usePayment } from '../../context/PaymentContext';

const AdminDashboard = () => {
  const { tips, addTip } = useTips();
  const { users } = useUsers();
  const { payments } = usePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate stats
  const totalUsers = users.length;
  const premiumUsers = users.filter((u: { plan: string; }) => u.plan !== 'FREE').length;
  const today = new Date().toISOString().split('T')[0];

const todayRevenue = payments
  .filter(
    (p) =>
      p.createdAt.startsWith(today) &&
      p.status === 'success'
  )
  .reduce((sum, p) => sum + p.amount, 0);

const totalTips = tips.length;


  const handleCreateTip = (tipData: {
    league: string;
    fixture: string;
    tip: string;
    odds: string;
    type: 'Free' | 'Premium';
  }) => {
    addTip(tipData);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Create New Tip
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <StatsCard title="Total Users" value={totalUsers.toString()} />
          <StatsCard title="Premium Users" value={premiumUsers.toString()} />
          <StatsCard title="Revenue Today" value={`KSH ${todayRevenue.toLocaleString()}`} />
          <StatsCard title="Tips Posted" value={totalTips.toString()} />
        </div>

        {/* TIPS TABLE */}
        <section className="admin-section">
          <h2>Recent Tips</h2>
          <TipsTable />
        </section>
      </main>

      <TipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTip}
      />
    </div>
  );
};

export default AdminDashboard;
