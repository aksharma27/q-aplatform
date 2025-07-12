const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
  type:      { type: String, enum: ['answer', 'comment', 'mention'], required: true },
  link:      { type: String } // e.g., /questions/:id
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);