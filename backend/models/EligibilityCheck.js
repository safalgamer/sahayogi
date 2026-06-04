const mongoose = require('mongoose');

const eligibilityCheckSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  sessionId: String,
  inputData: {
    businessType: { type: String, required: true },
    establishedYear: { type: Number, required: true },
    monthlyRevenue: { type: Number, required: true },
    employeeCount: Number,
    loanAmount: { type: Number, required: true },
    loanPurpose: { type: String, required: true },
    hasCollateral: Boolean,
    previousLoan: Boolean,
    province: String,
  },
  results: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    provider: String,
    matchScore: { type: Number, min: 0, max: 100 },
    estimatedAmount: Number,
    estimatedRate: String,
    breakdown: {
      businessAge: Number,
      revenue: Number,
      businessType: Number,
      loanAmount: Number,
      collateral: Number,
      loanPurpose: Number,
      employeeCount: Number,
      previousLoan: Number,
    },
    reasoning: String,
  }],
  topMatch: String,
  totalProductsScored: Number,
  ipAddress: String,
}, { timestamps: true });

eligibilityCheckSchema.index({ user: 1, createdAt: -1 });
eligibilityCheckSchema.index({ sessionId: 1, createdAt: -1 });
eligibilityCheckSchema.index({ createdAt: -1 });

module.exports = mongoose.model('EligibilityCheck', eligibilityCheckSchema);
