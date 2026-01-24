import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import Payments from "./pages/admin/Payments";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
         <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/admin/users" element={<UsersManagement />} />
  <Route path="/admin/payments" element={<Payments />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

