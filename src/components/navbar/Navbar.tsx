import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, userPlan } = useAuth();


  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={() => setOpen(false)}>BetTips</Link>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        </li>

        <li>
          <Link to="/free-tips" onClick={() => setOpen(false)}>Free Tips</Link>
        </li>

        <li>
          <Link to="/premium-tips" className="nav-btn premium" onClick={() => setOpen(false)}>
            Premium
          </Link>
        </li>

        <li>
          <Link to="/subscribe" className="nav-btn subscribe-btn" onClick={() => setOpen(false)}>
            Subscribe
          </Link>
        </li>

        {user ? (
          <>
            {userPlan && userPlan !== "NONE" && (
              <li>
                <span className="plan-badge">{userPlan}</span>
              </li>
            )}
            <li>
              <Link to="/profile" className="nav-avatar" onClick={() => setOpen(false)}>
                {user.fullName.charAt(0).toUpperCase()}
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            </li>
            <li>
              <Link to="/register" className="nav-register-btn" onClick={() => setOpen(false)}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="hamburger" onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </div>
    </nav>
  );
};

export default Navbar;
