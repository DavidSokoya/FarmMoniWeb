import React, { useState, useEffect, useContext } from 'react';
import { Wallet, TrendingUp, Sprout, Plus, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';

const StatCard = ({ title, amount, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">{amount}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch Wallet Data on Load
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await api.get('/wallet');
        setWallet(data);
      } catch (error) {
        console.error("Failed to fetch wallet", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Farm<span className="text-primary-600">Moni</span></h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.name}</span>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
            <p className="text-gray-500 mt-1">Track your investments and earnings.</p>
          </div>
          <div className="w-full sm:w-auto">
             {/* We will wire this button to Paystack later */}
            <Button>
              <Plus size={18} className="mr-2" /> Fund Wallet
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Wallet Balance" 
            amount={`₦${wallet.balance.toLocaleString()}`} 
            icon={Wallet} 
            color="bg-primary-500" 
          />
          <StatCard 
            title="Active Investments" 
            amount="₦0.00" 
            icon={Sprout} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Total ROI Earned" 
            amount="₦0.00" 
            icon={TrendingUp} 
            color="bg-emerald-600" 
          />
        </div>

        {/* Empty State for Projects */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Sprout className="text-primary-600" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No Investments Yet</h3>
          <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
            You haven't invested in any farms yet. Check out our available opportunities to start earning.
          </p>
          <button className="text-primary-600 font-medium hover:text-primary-700">
            View Opportunities &rarr;
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;