import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import api from '../services/api';

// Hardcoded List of Popular Nigerian Banks with CODES
const BANKS = [
  { name: 'Test Bank (Dev Only)', code: '000' },
  { name: 'Access Bank', code: '044' },
  { name: 'GTBank', code: '058' },
  { name: 'First Bank', code: '011' },
  { name: 'UBA', code: '033' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'Kuda Bank', code: '50211' },
  { name: 'OPay', code: '999992' },
  { name: 'PalmPay', code: '999991' },
  { name: 'FCMB', code: '214' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Stanbic IBTC', code: '221' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Moniepoint', code: '50515' }
];

const WithdrawModal = ({ isOpen, onClose, walletBalance, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Details, 2: Confirm
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState(''); // Stores the CODE (e.g. 058)
  const [accountName, setAccountName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Step 1: Verify Account Name
  const verifyAccount = async () => {
    setError('');
    setLoading(true);

    if (!bankCode) {
      setError("Please select a bank");
      setLoading(false);
      return;
    }

    try {
      // Sending Code and Number to Backend
      const { data } = await api.post('/wallet/resolve-account', {
        account_number: accountNumber,
        bank_code: bankCode 
      });

      setAccountName(data.account_name);
      setStep(2); // Move to confirmation
    } catch (err) {
      console.error(err);
      setError("Could not verify account name. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit Withdrawal Request
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/wallet/withdraw', {
        amount: Number(amount),
        accountNumber: accountNumber, 
        bankName: BANKS.find(b => b.code === bankCode)?.name,
        accountName: accountName,
        bankCode: bankCode
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
        
        <h2 className="text-xl font-bold mb-4">Request Withdrawal</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <Input 
              label="Amount (₦)" 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
             
             {/* BANK DROPDOWN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              >
                <option value="">-- Choose Bank --</option>
                {BANKS.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <Input 
              label="Account Number" 
              value={accountNumber} 
              onChange={(e) => setAccountNumber(e.target.value)} 
              maxLength={10}
            />

            <Button fullWidth onClick={verifyAccount} disabled={loading || !amount || !accountNumber || !bankCode}>
              {loading ? <span className="flex items-center gap-2"><Loader className="animate-spin" size={16}/> Verifying...</span> : 'Verify Account'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
               <CheckCircle size={32} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Transferring</p>
              <h3 className="text-2xl font-bold">₦{Number(amount).toLocaleString()}</h3>
              <p className="text-gray-500 text-sm mt-2">To: <span className="font-bold text-gray-900">{accountName}</span></p>
              <p className="text-gray-400 text-xs">{BANKS.find(b => b.code === bankCode)?.name} - {accountNumber}</p>
            </div>
            
            <Button fullWidth onClick={handleSubmit} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Withdrawal'}
            </Button>
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 underline">Back to Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;