import React from 'react';
import { MapPin, Clock, TrendingUp } from 'lucide-react';
import Button from './ui/Button';

const ProjectCard = ({ project, onInvest }) => {
  const price = project.pricePerSlot || project.price || 0;
  
  // Stock Calculation
  const totalStock = 100; // Default assumption
  const currentStock = project.availableUnits !== undefined ? project.availableUnits : 100;
  const percentSold = Math.min(100, Math.max(0, ((totalStock - currentStock) / totalStock) * 100));
  const isSoldOut = currentStock <= 0 || project.status === 'sold_out';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
      
      {/* Image Header */}
      <div className="h-48 relative overflow-hidden bg-gray-100">
        <img 
          src={project.image} 
          alt={project.title} 
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ${isSoldOut ? 'grayscale' : ''}`} 
        />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold shadow-sm uppercase ${
            isSoldOut ? 'bg-red-600 text-white' : 'bg-white/90 text-gray-900 backdrop-blur-sm'
        }`}>
          {isSoldOut ? 'Sold Out' : project.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.title}</h3>
           <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md shrink-0">
             <TrendingUp size={14} />
             <span className="text-xs font-bold">{project.roi}% ROI</span>
           </div>
        </div>

        {/* --- NEW: DESCRIPTION HERE --- */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        {/* ----------------------------- */}

        <div className="flex items-center text-gray-500 text-xs mb-4">
          <MapPin size={14} className="mr-1 text-gray-400" />
          <span className="truncate">{project.location}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 mt-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
            <span className={currentStock < 10 ? 'text-red-600' : ''}>
               {isSoldOut ? '0 units left' : `${currentStock} units left`}
            </span>
            <span>{Math.round(percentSold)}% Sold</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isSoldOut ? 'bg-gray-400' : (currentStock < 10 ? 'bg-red-500' : 'bg-primary-500')
              }`} 
              style={{ width: `${percentSold}%` }}
            ></div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Duration</p>
            <div className="flex items-center gap-1 font-semibold text-gray-700 text-sm">
               <Clock size={14} /> {project.duration}
            </div>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-400 mb-0.5">Unit Price</p>
             <p className="font-bold text-gray-900 text-lg">
               ₦{price.toLocaleString()} 
             </p>
          </div>
        </div>

        <Button 
          fullWidth 
          onClick={() => onInvest(project)}
          disabled={isSoldOut}
          variant={isSoldOut ? 'secondary' : 'primary'}
        >
          {isSoldOut ? 'Sold Out' : 'Invest Now'}
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;