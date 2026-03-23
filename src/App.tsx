import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Subscribe from './pages/Subscribe/Subscribe';
import Profile from './pages/Profile/Profile';
import FreeTips from './pages/FreeTips/FreeTips';
import PremiumTips from './pages/PremiumTips/PremiumTips';

import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import TipsManagement from './pages/admin/TipsManagement';
import ValueBets from './pages/admin/ValueBets';
import Payments from './pages/admin/Payments';
import SportPesa from './pages/ValueBets/SportPesa';
import Betika from './pages/ValueBets/Betika';
import CorrectScore from './pages/ValueBets/CorrectScore';
import GoalRange from './pages/ValueBets/GoalRange';
import PremiumPlans from './pages/admin/PremierPlans';

import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from './context/AuthContext';
import { TipsProvider } from './context/TipsCotext';
import { UsersProvider } from './context/UserContext';
import AdminRoute from './components/AdminRoutes';

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-container">
    <Navbar />
    <main className="content">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
        <ScrollToTop />
      <TipsProvider>
        <UsersProvider>
          <Routes>
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/subscribe" element={<MainLayout><Subscribe /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/free-tips" element={<MainLayout><FreeTips /></MainLayout>} />
            <Route path="/premium-tips" element={<MainLayout><PremiumTips /></MainLayout>} />
            <Route path="/value-bets/sportpesa" element={<MainLayout><SportPesa /></MainLayout>} />
            <Route path="/value-bets/betika" element={<MainLayout><Betika /></MainLayout>} />
            <Route path="/value-bets/correct-score" element={<MainLayout><CorrectScore /></MainLayout>} />
            <Route path="/value-bets/goal-range" element={<MainLayout><GoalRange /></MainLayout>} />

            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
<Route path="/admin/users" element={<AdminRoute><UsersManagement /></AdminRoute>} />
<Route path="/admin/tips" element={<AdminRoute><TipsManagement /></AdminRoute>} />
<Route path="/admin/premium" element={<AdminRoute><PremiumPlans /></AdminRoute>} />
<Route path="/admin/value-bets" element={<AdminRoute><ValueBets /></AdminRoute>} />
<Route path="/admin/payments" element={<AdminRoute><Payments /></AdminRoute>} />
          </Routes>
        </UsersProvider>
      </TipsProvider>
    </AuthProvider>
  );
}

export default App;
