const mongoose = require('mongoose');

const eligibilityCriteriaSchema = new mongoose.Schema({
  minYearsInBusiness: { type: Number, default: 0, min: 0 },
  minMonthlyRevenue: { type: Number, default: 0, min: 0 },
  minEmployeeCount: { type: Number, default: 0, min: 0 },
  requiredDocuments: [String],
  businessTypes: [{
    type: String,
    enum: ['retail', 'wholesale', 'manufacturing', 'service', 'agriculture', 'other'],
  }],
  provinces: [String],
  loanPurposes: [{
    type: String,
    enum: ['working_capital', 'expansion', 'equipment', 'inventory', 'other'],
  }],
  creditScoreMin: { type: Number, default: 0, min: 0, max: 850 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 200,
  },
  provider: {
    type: String,
    required: [true, 'Provider name is required'],
    trim: true,
  },
  providerType: {
    type: String,
    required: true,
    enum: ['bank', 'development_bank', 'microfinance', 'government', 'cooperative', 'private_lender'],
  },
  loanType: {
    type: String,
    required: true,
    enum: ['working_capital', 'term_loan', 'micro_loan', 'equipment_financing', 'overdraft', 'invoice_financing'],
  },
  description: { type: String, required: true, maxlength: 2000 },
  minAmount: { type: Number, required: true, min: 0 },
  maxAmount: { type: Number, required: true, min: 0 },
  interestRateMin: { type: Number, required: true, min: 0, max: 100 },
  interestRateMax: { type: Number, required: true, min: 0, max: 100 },
  tenureMinMonths: { type: Number, required: true, min: 1 },
  tenureMaxMonths: { type: Number, required: true, min: 1 },
  processingFee: { type: String, default: 'Varies' },
  collateralRequired: { type: Boolean, default: false },
  eligibilityCriteria: { type: eligibilityCriteriaSchema, default: () => ({}) },
  features: [String],
  contactPhone: String,
  contactEmail: String,
  website: String,
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

productSchema.index({ isActive: 1, providerType: 1, loanType: 1 });
productSchema.index({ name: 'text', description: 'text', provider: 'text' });
productSchema.index({ minAmount: 1, maxAmount: 1 });

productSchema.pre('validate', function() {
  if (this.minAmount > this.maxAmount) {
    throw new Error('minAmount must be <= maxAmount');
  }
  if (this.interestRateMin > this.interestRateMax) {
    throw new Error('interestRateMin must be <= interestRateMax');
  }
  if (this.tenureMinMonths > this.tenureMaxMonths) {
    throw new Error('tenureMinMonths must be <= tenureMaxMonths');
  }
});

module.exports = mongoose.model('Product', productSchema);
