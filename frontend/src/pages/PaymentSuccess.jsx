import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference'); // Get 'reference' from URL
  
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('Verifying your payment...');
  
  // Use a ref to prevent double-firing in React Strict Mode
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No transaction reference found.');
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyTransaction = async () => {
      try {
        // Call your Backend Verify Route
        await api.post('/wallet/verify', { reference });
        
        setStatus('success');
        setMessage('Payment successful! Your wallet has been funded.');
        
        // Optional: Auto-redirect after 3 seconds
        setTimeout(() => navigate('/dashboard'), 3000);
        
      } catch (error) {
        console.error(error);
        // If backend says "Transaction already processed", we treat it as success
        if (error.response?.data?.message?.includes('already processed')) {
            setStatus('success');
            setMessage('Payment successful!');
            setTimeout(() => navigate('/dashboard'), 3000);
        } else {
            setStatus('error');
            setMessage('Verification failed. Please contact support.');
        }
      }
    };

    verifyTransaction();
  }, [reference, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader className="animate-spin text-primary-600 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-900">Verifying...</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-2 mb-6">{message}</p>
            <Button onClick={() => navigate('/dashboard')} fullWidth>
              Go to Dashboard
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-red-500 mt-2 mb-6">{message}</p>
            <Button onClick={() => navigate('/dashboard')} fullWidth>
              Return to Dashboard
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;