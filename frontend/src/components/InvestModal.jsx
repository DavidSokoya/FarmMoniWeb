import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight, Loader } from 'lucide-react';
import Button from './ui/Button';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const InvestModal = ({ project, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // If modal is closed or no project data, return nothing
  if (!isOpen || !project) return null;

  // --- SAFETY CHECK ---
  // We check for 'pricePerSlot' first (new schema), then 'price' (old schema), then default to 0
  // This prevents the "toLocaleString of undefined" crash
  const pricePerSlot = project.pricePerSlot || project.price || 0;
  
  const totalCost = slots * pricePerSlot;

  const handleInvest = async () => {
    setLoading(true);
    setError('');

    try {
      // API CALL matches your backend route: router.post('/invest', ...)
      await api.post('/projects/invest', {
        projectId: project._id,
        slots: Number(slots) // Send 'slots' to match your controller logic
      });
      
      // Success Feedback
      alert('Investment Successful! Redirecting to Dashboard...');
      onClose();
      navigate('/dashboard'); 
      
    } catch (err) {
      // Handle Error
      console.error(err);
      setError(err.response?.data?.message || 'Investment failed. Please check your wallet balance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{project.title}</h2>
          <p className="text-sm text-gray-500">Complete your investment below</p>
        </div>

        {/* Cost Calculator Card */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
           {/* Price Row */}
           <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-gray-500">Price per Unit</span>
              <span className="font-semibold text-gray-900">₦{pricePerSlot.toLocaleString()}</span>
           </div>
           
           {/* Slot Selector Row */}
           <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-500">Units (Slots)</span>
              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setSlots(Math.max(1, slots - 1))}
                   className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition-colors"
                 >-</button>
                 <span className="font-mono font-bold w-6 text-center text-lg">{slots}</span>
                 <button 
                   onClick={() => setSlots(slots + 1)}
                   className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 flex items-center justify-center font-bold transition-colors"
                 >+</button>
              </div>
           </div>

           {/* Total Row */}
           <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-gray-900 font-bold">Total Cost</span>
              <span className="text-xl font-extrabold text-primary-600">₦{totalCost.toLocaleString()}</span>
           </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 mb-4 animate-in slide-in-from-top-1">
            <AlertCircle size={18} className="shrink-0 mt-0.5" /> 
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <Button fullWidth onClick={handleInvest} disabled={loading}>
          {loading ? (
             <span className="flex items-center gap-2">
               <Loader size={18} className="animate-spin" /> Processing...
             </span>
          ) : (
             <span className="flex items-center gap-2">
               Confirm Investment <ArrowRight size={18} />
             </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default InvestModal;