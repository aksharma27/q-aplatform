const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content:  { type: String, required: true }, // Rich text (HTML string)
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  votes: {
    up:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    down: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
}, { timestamps: true });

module.exports = mongoose.models.Answer || mongoose.model('Answer', answerSchema);