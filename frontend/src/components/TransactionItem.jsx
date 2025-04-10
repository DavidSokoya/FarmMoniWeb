import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout'; // Assuming you have a layout wrapper
import api from '../services/api';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

const Transactions = () => {
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

  // Helper for Status Colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'failed': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Helper for Icon
  const getIcon = (type) => {
    if (type === 'deposit' || type === 'payout') return <ArrowDownLeft className="text-green-600" />;
    return <ArrowUpRight className="text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold">Reference</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2 font-medium capitalize text-gray-700">
                          <div className={`p-2 rounded-full ${tx.type === 'investment' || tx.type === 'withdrawal' ? 'bg-red-50' : 'bg-green-50'}`}>
                             {getIcon(tx.type)}
                          </div>
                          {tx.type}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs truncate">{tx.description}</td>
                      <td className="p-4 text-gray-400 font-mono text-xs">{tx.reference}</td>
                      <td className={`p-4 font-bold font-mono ${
                        tx.type === 'deposit' || tx.type === 'roi_payout' 
                          ? 'text-green-600' 
                          : 'text-gray-900'
                      }`}>
                        {tx.type === 'investment' || tx.type === 'withdrawal' ? '-' : '+'}
                        ₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                        <span className="block text-xs text-gray-400">
                          {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(tx.status)}`}>
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
    </div>
  );
};

export default Transactions;