import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { CheckCircle, XCircle, Clock, Search, AlertCircle, ArrowUpRight } from 'lucide-react';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending', 'success', 'failed'

  const fetchWithdrawals = async () => {
    try {
      const { data } = await api.get('/admin/withdrawals');
      setWithdrawals(data);
    } catch (error) {
      alert("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;

    try {
      await api.put(`/admin/withdrawals/${id}/${action}`);
      alert(`Withdrawal ${action}d successfully`);
      fetchWithdrawals(); // Refresh list
    } catch (error) {
      alert(`Failed to ${action} withdrawal`);
    }
  };

  const filteredList = withdrawals.filter(tx => tx.status === filter);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Withdrawal Requests</h1>
        <p className="text-gray-400">Manage payout requests from users.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700 pb-1">
        {['pending', 'success', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`pb-3 px-2 text-sm font-medium capitalize transition-colors border-b-2 ${
              filter === status 
                ? 'border-primary-500 text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {status} ({withdrawals.filter(w => w.status === status).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white text-center py-10">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
              <div className="bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                 <CheckCircle className="text-gray-500" />
              </div>
              <p className="text-gray-400">No {filter} requests found.</p>
            </div>
          ) : (
            filteredList.map((tx) => (
              <div key={tx._id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-600 transition-colors">
                
                {/* Left: Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{tx.user?.name || 'Unknown User'}</h3>
                    <span className="text-xs text-gray-500 font-mono bg-gray-900 px-2 py-0.5 rounded">{tx.reference}</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {tx.description}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(tx.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Middle: Amount */}
                <div className="text-left md:text-right">
                  <span className="block text-xs text-gray-500 uppercase">Amount</span>
                  <span className="text-2xl font-bold text-white font-mono">₦{tx.amount.toLocaleString()}</span>
                </div>

                {/* Right: Actions (Only for Pending) */}
                {filter === 'pending' && (
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleAction(tx._id, 'reject')}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button 
                      onClick={() => handleAction(tx._id, 'approve')}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-900/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Paid & Approve
                    </button>
                  </div>
                )}
                
                {/* Status Badge (For History) */}
                {filter !== 'pending' && (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    filter === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {filter}
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWithdrawals;