import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

const InvestmentItem = ({ investment }) => {
  const { project, units, amountInvested, expectedReturn, maturityDate } = investment;
  
  // Calculate days left
  const today = new Date();
  const end = new Date(maturityDate);
  const totalDuration = new Date(project.duration); // This might need parsing if "6 Months" string
  // For simplicity, let's just show the Date
  
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
      
      {/* Left: Image & Title */}
      <div className="flex items-center gap-4">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h4 className="font-bold text-gray-900">{project.title}</h4>
          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded text-xs font-medium">
              {units} Units
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
               <TrendingUp size={12} /> {project.roi}% ROI
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Financials */}
      <div className="text-right sm:text-left">
        <p className="text-xs text-gray-400">Invested</p>
        <p className="font-semibold text-gray-900">₦{amountInvested.toLocaleString()}</p>
      </div>

      <div className="text-right sm:text-left">
        <p className="text-xs text-gray-400">Expected Return</p>
        <p className="font-semibold text-green-600">₦{expectedReturn.toLocaleString()}</p>
      </div>

      {/* Right: Date */}
      <div className="text-right hidden sm:block">
        <p className="text-xs text-gray-400">Maturity Date</p>
        <div className="flex items-center justify-end gap-1 text-gray-600 text-sm font-medium">
          <Calendar size={14} />
          {new Date(maturityDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default InvestmentItem;