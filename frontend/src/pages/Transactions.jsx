import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DashboardLayout from '../components/DashboardLayout'; 
import api from '../services/api';
import { ArrowUpRight, ArrowDownLeft, ArrowLeft, Loader } from 'lucide-react'; // Import ArrowLeft

const Transactions = () => {
  const navigate = useNavigate(); // Initialize hook
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const { data } = await api.get('/wallet/transactions');
        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-700 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'failed': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getIcon = (type) => {
    if (type === 'deposit' || type === 'roi_payout') return <ArrowDownLeft className="text-green-600" size={18} />;
    return <ArrowUpRight className="text-red-600" size={18} />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        
        {/* --- NEW BACK BUTTON --- */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        {/* ----------------------- */}

        <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
           <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
             {transactions.length} Records
           </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <Loader className="animate-spin text-primary-600" size={32} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <ArrowUpRight className="text-gray-400" size={24} />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No transactions yet</h3>
            <p className="text-gray-500 text-sm">Your financial activity will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-4 font-semibold pl-6">Type</th>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold">Reference</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3 font-medium capitalize text-gray-700">
                          <div className={`p-2 rounded-lg ${
                             tx.type === 'deposit' || tx.type === 'roi_payout' ? 'bg-green-100' : 'bg-red-50'
                          }`}>
                             {getIcon(tx.type)}
                          </div>
                          {tx.type.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs truncate" title={tx.description}>
                        {tx.description}
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-xs">{tx.reference}</td>
                      <td className={`p-4 font-bold font-mono text-base ${
                        tx.type === 'deposit' || tx.type === 'roi_payout' 
                          ? 'text-green-600' 
                          : 'text-gray-900'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'roi_payout' ? '+' : '-'}
                        ₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-500">
                        <div className="flex flex-col">
                          <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;