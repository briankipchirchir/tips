import AdminSidebar from "../../components/admin/AdminSidebar";
import StatsCard from "../../components/admin/StatsCard";
import TipsTable from "../../components/admin/TipsTable";
import "../../styles/admin.css";

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        <h1>Admin Dashboard</h1>

        {/* STATS */}
        <div className="stats-grid">
          <StatsCard title="Total Users" value="1,245" />
          <StatsCard title="Premium Users" value="312" />
          <StatsCard title="Revenue Today" value="KSH 18,500" />
          <StatsCard title="Tips Posted" value="24" />
        </div>

        {/* TIPS TABLE */}
        <section className="admin-section">
          <h2>Recent Tips</h2>
          <TipsTable />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
