import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace'; 
import Transactions from './pages/Transactions'; 
import PaymentSuccess from './pages/PaymentSuccess';
import LandingPage from './pages/LandingPage'; 

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'; 
import AdminFarms from './pages/admin/AdminFarms';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInvestments from './pages/admin/AdminInvestments';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';

// Route Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute'; 

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- REGULAR USER ROUTES (Use PrivateRoute) --- */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

        {/* --- ADMIN ROUTES (Use AdminRoute) --- */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        <Route path="/admin/farms" element={
          <AdminRoute>
            <AdminFarms />
          </AdminRoute>
        } />

        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        } />
        
        <Route path="/admin/investments" element={
          <AdminRoute>
            <AdminInvestments />
          </AdminRoute>
        } />
      <Route path="/admin/withdrawals" element={
        <AdminRoute>
          <AdminWithdrawals />
        </AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;