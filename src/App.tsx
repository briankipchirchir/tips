import { Routes, Route } from 'react-router-dom';

// Main Site Components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import TipsManagement from './pages/admin/TipsManagement';
import ValueBets from './pages/admin/ValueBets';
import Payments from './pages/admin/Payments';
import PremiumPlans from './pages/admin/PremierPlans';

// Context Providers
import { TipsProvider } from './context/TipsCotext';
import { UsersProvider } from './context/UserContext';

function App() {
  return (
    <TipsProvider>
      <UsersProvider>
        <Routes>
          {/* Main Site Routes with Navbar and Footer */}
          <Route
            path="/"
            element={
              <div className="app-container">
                <Navbar />
                <main className="content">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />

          <Route
            path="/login"
            element={
              <div className="app-container">
                <Navbar />
                <main className="content">
                  <Login />
                </main>
                <Footer />
              </div>
            }
          />

          {/* Admin Routes (no Navbar/Footer) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/tips" element={<TipsManagement />} />
          <Route path="/admin/premium" element={<PremiumPlans />} />
          <Route path="/admin/value-bets" element={<ValueBets />} />
          <Route path="/admin/payments" element={<Payments />} />
        </Routes>
      </UsersProvider>
    </TipsProvider>
  );
}

export default App;

