import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { 
  Search, 
  Calendar, 
  User, 
  Sprout, 
  TrendingUp, 
  Coins, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data
  const fetchInvestments = async () => {
    try {
      const { data } = await api.get('/admin/investments');
      setInvestments(data);
    } catch (error) {
      console.error("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // 2. Handle ROI Payout
  const handlePayout = async (id, amount, projectTitle) => {
    const confirmMsg = `Are you sure you want to pay ₦${amount.toLocaleString()} for "${projectTitle}"?\n\nThis will immediately credit the user's wallet.`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.put(`/admin/investments/${id}/pay`);
      alert("ROI Paid Successfully! Wallet Credited.");
      fetchInvestments(); // Refresh table to show 'Completed'
    } catch (error) {
      alert("Payout failed: " + (error.response?.data?.message || error.message));
    }
  };

  // 3. Filter & Stats
  const filtered = investments.filter(inv => 
    (inv.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.project?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVolume = investments.reduce((acc, curr) => acc + curr.amountInvested, 0);

  return (
    <AdminLayout>
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Investment Ledger</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
             <TrendingUp size={16} className="text-green-500"/>
             Total Volume Traded: 
             <span className="text-green-400 font-mono font-bold text-lg">
               ₦{totalVolume.toLocaleString()}
             </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search farm or investor..." 
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="text-white text-center py-20 animate-pulse">Loading ledger...</div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-900 text-gray-200 uppercase font-bold text-xs tracking-wider">
                <tr>
                  <th className="p-5">Investor</th>
                  <th className="p-5">Project / Farm</th>
                  <th className="p-5">Units</th>
                  <th className="p-5">Amount Paid</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filtered.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-700/40 transition-colors">
                    
                    {/* Investor Column */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                           <User size={14} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{inv.user?.name || 'Unknown User'}</p>
                          <p className="text-xs text-gray-500">{inv.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Project Column */}
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                         <Sprout size={16} className="text-green-500" />
                         <span className="text-gray-200 font-medium">{inv.project?.title || 'Deleted Project'}</span>
                      </div>
                    </td>

                    {/* Units Column */}
                    <td className="p-5">
                      <span className="bg-gray-700 text-white px-2.5 py-1 rounded-md text-xs font-bold border border-gray-600">
                        {inv.slots} Slots
                      </span>
                    </td>

                    {/* Amount Column */}
                    <td className="p-5 text-white font-mono font-bold">
                      ₦{inv.amountInvested.toLocaleString()}
                    </td>

                    {/* Date Column */}
                    <td className="p-5 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Calendar size={14} />
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-gray-600 mt-1 pl-5">
                        {new Date(inv.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>

                    {/* ACTION COLUMN (The Important Part) */}
                    <td className="p-5 text-right">
                       {inv.status === 'active' ? (
                         <div className="flex flex-col items-end gap-2">
                           {/* Status Badge */}
                           <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-500/10 text-green-400 border border-green-500/20 mb-1">
                             Active
                           </span>
                           
                           {/* Pay Button */}
                           <button 
                             onClick={() => handlePayout(inv._id, inv.expectedReturn, inv.project?.title)}
                             className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-green-900/20 border border-green-500"
                             title={`Click to pay ₦${inv.expectedReturn.toLocaleString()}`}
                           >
                             <Coins size={14} /> 
                             Pay ROI (₦{inv.expectedReturn.toLocaleString()})
                           </button>
                         </div>
                       ) : (
                         <div className="flex flex-col items-end gap-1">
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gray-700 text-gray-400 border border-gray-600">
                              <CheckCircle size={12} /> Completed
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Paid out
                            </span>
                         </div>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500 bg-gray-800/50">
              <Sprout size={48} className="mx-auto mb-3 opacity-20" />
              <p>No investments match your search.</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminInvestments;