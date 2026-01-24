import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">BetTips Admin</h2>

      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/tips">Tips</Link>
        <Link to="/admin/premium">Premium Plans</Link>
        <Link to="/admin/value-bets">Value Bets</Link>
        <Link to="/">Back to Site</Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
