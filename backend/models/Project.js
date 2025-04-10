const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  roi: { type: Number, required: true },
  duration: { type: String, required: true },
  // We will use 'pricePerSlot' as the standard name
  pricePerSlot: { type: Number, required: true }, 
  investors: { type: Number, default: 0 },
  availableUnits: { type: Number, default: 100 }, // Default 100 slots per farm
  status: { 
    type: String, 
    enum: ['open', 'sold-out', 'closed'], 
    default: 'open' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);