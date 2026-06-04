const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['application_status', 'new_product', 'tip', 'system', 'admin'],
    required: true,
  },
  title: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true, maxlength: 2000 },
  link: String,
  relatedModel: String,
  relatedId: mongoose.Schema.Types.ObjectId,
  isRead: { type: Boolean, default: false },
  isActionable: { type: Boolean, default: false },
  actionLabel: String,
  readAt: Date,
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
