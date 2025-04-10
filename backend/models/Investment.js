const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  slots: { // <--- Added this field
    type: Number,
    required: true,
    default: 1
  },
  amountInvested: {
    type: Number,
    required: true
  },
  expectedReturn: {
    type: Number,
    required: true
  },
  roi: { // <--- Added this field (snapshot of ROI at time of purchase)
    type: Number,
    required: true
  },
  maturityDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Investment', investmentSchema);