import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.phone.length < 9) {
      setError("Enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.phone, form.password);
      navigate("/");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-glow" />
      <div className="register-card">
        <div className="register-brand">
          <span className="brand-dot" />
          BetTips
        </div>
        <h1 className="register-title">Create your account</h1>
        <p className="register-sub">Join thousands of winning bettors</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Full Name</label>
            <input name="fullName" type="text" placeholder="John Kamau" required value={form.fullName} onChange={handleChange} />
          </div>

          <div className="field-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" required value={form.email} onChange={handleChange} />
          </div>

          <div className="field-group">
            <label>Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="phone-prefix">🇰🇪 +254</span>
              <input name="phone" type="tel" placeholder="7XX XXX XXX" required value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label>Password</label>
              <input name="password" type="password" placeholder="Min. 8 characters" required minLength={8} value={form.password} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" placeholder="Repeat password" required value={form.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          {error && <p className="register-error">{error}</p>}

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Create Account"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
