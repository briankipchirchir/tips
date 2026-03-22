import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(phone, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid phone or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow" />
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-dot" />
          BetTips
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-sub">Sign in to access your tips and subscription</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="phone-prefix">🇰🇪 +254</span>
              <input
                type="tel"
                placeholder="7XX XXX XXX"
                required
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
              />
            </div>
          </div>

          <div className="field-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <input
              type="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>

        <div className="login-divider"><span>or</span></div>

        <div className="login-actions">
          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/register" className="login-link">Create one free</Link>
          </p>
          <Link to="/subscribe" className="login-subscribe-cta">
            View Premium Plans →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
