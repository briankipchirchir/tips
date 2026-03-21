import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

const NAV = [
  { section: "Overview" },
  { label: "Dashboard",       path: "/admin",              icon: "📊" },
  { section: "Content" },
  { label: "Tips Management", path: "/admin/tips",         icon: "⚽" },
  { label: "Value Bets",      path: "/admin/value-bets",   icon: "🎯" },
  { section: "Users" },
  { label: "Users",           path: "/admin/users",        icon: "👥" },
  { label: "Payments",        path: "/admin/payments",     icon: "💳" },
  { section: "Settings" },
  { label: "Premium Plans",   path: "/admin/premium",      icon: "💎" },
];

const AdminLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">BetTips</span>
          <span className="sidebar-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) =>
            "section" in item ? (
              <div className="sidebar-section-label" key={i}>{item.section}</div>
            ) : (
              <Link
                key={item.path}
                to={item.path!}
                className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.fullName?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.fullName ?? "Admin"}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
            <button className="btn-icon" onClick={handleLogout} title="Logout">🚪</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <span className="admin-topbar-title">{title}</span>
          </div>
          <div className="admin-topbar-actions">
            <Link to="/" className="btn-secondary" style={{ textDecoration: "none", fontSize: "0.8rem" }}>
              ← View Site
            </Link>
          </div>
        </div>

        <div className="admin-content">{children}</div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
