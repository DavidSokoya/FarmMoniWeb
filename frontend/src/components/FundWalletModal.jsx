import React, { useState } from 'react';
import { X, ArrowRight, CreditCard, Lock } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import api from '../services/api';

const FundWalletModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFund = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Call your backend 'depositFunds'
      const { data } = await api.post('/wallet/deposit', { amount: Number(amount) });
      
      // 2. Backend returns Paystack URL -> Redirect user there
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error(error);
      alert("Failed to initialize payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
            <CreditCard className="text-green-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Fund Your Wallet</h2>
          <p className="text-gray-500 text-sm">Secured by Paystack</p>
        </div>

        <form onSubmit={handleFund} className="space-y-4">
          <Input
            label="Amount (₦)"
            type="number"
            placeholder="e.g. 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="100"
          />

          <div className="flex gap-2">
             {[1000, 5000, 10000].map((amt) => (
               <button
                 key={amt}
                 type="button"
                 onClick={() => setAmount(amt)}
                 className="flex-1 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
               >
                 ₦{amt.toLocaleString()}
               </button>
             ))}
          </div>

          <Button fullWidth isLoading={isLoading} type="submit">
            Proceed to Payment <ArrowRight className="ml-2 h-4 w-4 inline" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
            <Lock size={12} />
            <span>256-bit Encrypted Payment</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundWalletModal;