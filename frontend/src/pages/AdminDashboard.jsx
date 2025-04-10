import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Activity, CheckCircle, ShieldAlert, 
  TrendingUp, ArrowUpRight, ArrowDownLeft, Clock 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for the chart (since we don't have historical data stored yet)
  const chartData = [
    { name: 'Mon', volume: 4000 },
    { name: 'Tue', volume: 3000 },
    { name: 'Wed', volume: 2000 },
    { name: 'Thu', volume: 2780 },
    { name: 'Fri', volume: 1890 },
    { name: 'Sat', volume: 2390 },
    { name: 'Sun', volume: 3490 },
  ];

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error("Access Denied or Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApprove = async (id) => {
    if(!window.confirm("Approve this withdrawal?")) return;
    try {
      await api.put(`/admin/withdrawals/${id}/approve`); // Updated route
      alert("Approved!");
      fetchStats();
    } catch (error) {
      alert("Failed to approve");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <p className="text-gray-400 mt-1">System Overview & Liquidity Monitor</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> System Online
           </span>
        </div>
      </div>

      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
          <p className="text-gray-400 font-medium z-10 relative">Total Investors</p>
          <div className="flex justify-between items-center mt-2 z-10 relative">
            <h3 className="text-4xl font-bold text-white">{stats?.totalUsers || 0}</h3>
            <Users className="text-blue-500" size={28} />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-yellow-500/20"></div>
          <p className="text-gray-400 font-medium z-10 relative">Platform Volume</p>
          <div className="flex justify-between items-center mt-2 z-10 relative">
            <h3 className="text-4xl font-bold text-white">₦{(stats?.totalVolume || 0).toLocaleString()}</h3>
            <DollarSign className="text-yellow-500" size={28} />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-green-500/20"></div>
          <p className="text-gray-400 font-medium z-10 relative">Active Investments</p>
          <div className="flex justify-between items-center mt-2 z-10 relative">
            <h3 className="text-4xl font-bold text-white">{stats?.totalInvestments || 0}</h3>
            <Activity className="text-green-500" size={28} />
          </div>
        </div>
      </div>

      {/* 2. CHART & ACTIVITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* CHART SECTION (Left - 2/3 width) */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Investment Traffic (7 Days)</h3>
          <div className="w-full">
            <ResponsiveContainer width="100%" height="100%" aspect={3}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} tickFormatter={(val) => `₦${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#10B981' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY (Right - 1/3 width) */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentActivity?.map((act) => (
              <div key={act._id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700/50 transition-colors">
                <div className={`mt-1 p-1.5 rounded-full ${
                  act.type === 'deposit' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {act.type === 'deposit' ? <ArrowDownLeft size={12}/> : <ArrowUpRight size={12}/>}
                </div>
                <div>
                  <p className="text-sm text-gray-200 font-medium">
                    {act.user?.name} 
                    <span className="text-gray-500 font-normal"> {act.type === 'deposit' ? 'funded' : 'withdrew'} </span>
                    <span className="text-white font-mono">₦{act.amount.toLocaleString()}</span>
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock size={10} /> {new Date(act.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">No recent activity.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. PENDING WITHDRAWALS (Critical Section) */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
             <h3 className="text-xl font-bold text-white">Pending Withdrawals</h3>
          </div>
          <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-500/20">
            {stats?.pendingWithdrawals?.length || 0} Request(s)
          </span>
        </div>
        
        {stats?.pendingWithdrawals?.length === 0 ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center">
            <CheckCircle size={48} className="mb-4 text-green-500/20" />
            <p className="text-lg font-medium text-gray-400">All Clear!</p>
            <p className="text-sm">No pending withdrawal requests at the moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-5 font-medium">User</th>
                  <th className="p-5 font-medium">Amount</th>
                  <th className="p-5 font-medium">Bank Details</th>
                  <th className="p-5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.pendingWithdrawals.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-white">{tx.user?.name}</p>
                        <p className="text-xs text-gray-500">{tx.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-5 font-mono text-yellow-400 font-bold text-lg">
                      ₦{tx.amount.toLocaleString()}
                    </td>
                    <td className="p-5 text-sm text-gray-300">
                      {tx.description}
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleApprove(tx._id)}
                        className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95"
                      >
                        Approve Payout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;