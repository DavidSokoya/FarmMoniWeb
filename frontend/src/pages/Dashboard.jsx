import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  LayoutDashboard,
  ShieldCheck,
  History
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import WithdrawModal from '../components/WithdrawModal';
import FundWalletModal from '../components/FundWalletModal'; // <--- IMPORT YOUR NEW MODAL
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [wallet, setWallet] = useState({ balance: 0 });
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false); // <--- NEW STATE

  // Fetch Data
  const fetchDashboardData = async () => {
    try {
      const [walletRes, invRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/projects/my-investments')
      ]);
      setWallet(walletRes.data);
      setInvestments(invRes.data);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
             <img src="/farmmoni-logo.png" alt="FarmMoni" className="h-8 w-auto" />
             <span className="text-xl font-bold text-gray-900 hidden sm:block">Farm<span className="text-primary-600">Moni</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">Welcome, {user?.name}</span>
            <button onClick={logout} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Wallet Card Section */}
        <section className="mb-8">
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden transition-transform hover:scale-[1.01] duration-300">
            <div className="absolute top-0 right-0 p-16 bg-green-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-gray-400 font-medium flex items-center gap-2">
                    <Wallet size={18} /> Total Balance
                  </p>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-mono text-white">
                  ₦ {wallet.balance?.toLocaleString()}
                </h1>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                {/* DEPOSIT BUTTON: Triggers isFundModalOpen */}
                <Button 
                   variant="secondary" 
                   className="flex-1 md:flex-none justify-center bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                   onClick={() => setIsFundModalOpen(true)} 
                >
                  <ArrowDownLeft size={18} className="mr-2" /> Deposit
                </Button>

                <Button 
                   variant="primary" 
                   className="flex-1 md:flex-none justify-center bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg shadow-green-500/20"
                   onClick={() => setIsWithdrawModalOpen(true)}
                >
                  <ArrowUpRight size={18} className="mr-2" /> Withdraw
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><LayoutDashboard size={20}/></div>
               <span className="text-gray-500 font-medium text-sm">Active Plans</span>
             </div>
             <p className="text-3xl font-bold text-gray-900 mt-auto">{investments.length}</p>
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20}/></div>
               <span className="text-gray-500 font-medium text-sm">Total ROI Expected</span>
             </div>
             <p className="text-3xl font-bold text-gray-900 mt-auto truncate font-mono tracking-tight">
               ₦ {investments.reduce((acc, curr) => acc + (curr.expectedReturn - curr.amountInvested), 0).toLocaleString()}
             </p>
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShieldCheck size={20}/></div>
               <span className="text-gray-500 font-medium text-sm">Account Status</span>
             </div>
             <p className="text-xl font-bold text-gray-900 mt-auto flex items-center gap-2">
               Verified <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
             </p>
           </div>
        </div>

        {/* Portfolio Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Portfolio</h2>
            <div className="flex gap-2">
               <Button size="sm" variant="secondary" onClick={() => navigate('/transactions')}>
                 <History size={16} className="mr-2"/> History
               </Button>
               <Button size="sm" variant="outline" onClick={() => navigate('/marketplace')}>
                  + New Investment
               </Button>
            </div>
          </div>

          {investments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-200 border-dashed">
              <div className="mx-auto h-16 w-16 text-gray-300 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-gray-900 font-medium text-lg mb-2">No investments yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Your portfolio is currently empty.</p>
              <Button onClick={() => navigate('/marketplace')}>Explore Marketplace</Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {investments.map((inv) => (
                <div key={inv._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className="h-20 w-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 relative">
                      {inv.project?.image ? (
                        <img src={inv.project.image} alt="Project" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400"><TrendingUp size={24}/></div>
                      )}
                    </div>
                    <div className="flex flex-col h-full justify-between py-0.5">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{inv.project?.title || 'Unknown Project'}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1 max-w-md mb-2">
                          {inv.project?.description || "No description available"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                         <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                           {inv.slots} Unit{inv.slots > 1 ? 's' : ''}
                         </span> 
                         <span>•</span>
                         <span>Ordered: {new Date(inv.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto mt-2 md:mt-0 pl-0 md:pl-4 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                     <div className="text-left md:text-right">
                       <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Invested</p>
                       <p className="font-bold text-gray-900 font-mono text-lg">₦{inv.amountInvested.toLocaleString()}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Expected Return</p>
                       <p className="font-bold text-green-600 font-mono text-lg">₦{inv.expectedReturn.toLocaleString()}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* RENDER MODALS */}
      
      {/* 1. Withdraw Modal */}
      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)}
        walletBalance={wallet.balance}
        onSuccess={() => {
           fetchDashboardData(); 
           alert("Withdrawal request submitted successfully!");
        }}
      />

      {/* 2. Fund Wallet Modal */}
      <FundWalletModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
      />

    </div>
  );
};

export default Dashboard;