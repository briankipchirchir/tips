import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setOpen(false);

    // If not on home, navigate first
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <h2 className="logo">BetTips</h2>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        </li>

        <li>
          <button className="nav-btn" onClick={() => scrollToSection("free-tips")}>
            Free Tips
          </button>
        </li>

        <li>
          <button className="nav-btn premium" onClick={() => scrollToSection("premium-tips")}>
            Premium
          </button>
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


