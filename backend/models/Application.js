const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  eligibilityCheck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EligibilityCheck',
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'documents_requested', 'approved', 'rejected', 'disbursed', 'cancelled'],
    default: 'draft',
  },
  statusHistory: [{
    status: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    changedAt: { type: Date, default: Date.now },
  }],
  loanAmount: { type: Number, required: true, min: 0 },
  tenureMonths: { type: Number, required: true, min: 1 },
  purpose: {
    type: String,
    enum: ['working_capital', 'expansion', 'equipment', 'inventory', 'other'],
  },
  documents: [{
    name: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  }],
  notes: String,
  submittedAt: Date,
  decisionAt: Date,
  decisionNote: String,
}, { timestamps: true });

applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ product: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
