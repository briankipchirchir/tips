import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="logo">BetTips</h2>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/free-tips" onClick={() => setOpen(false)}>Free Tips</Link>
        </li>
        <li>
          <Link to="/premium" onClick={() => setOpen(false)}>Premium</Link>
        </li>
        <li>
          <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
        </li>
      </ul>

      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;

