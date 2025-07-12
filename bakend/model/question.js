const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true }, // Rich text (HTML string)
  tags:        [{ type: String }],
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
  votes: {
    up:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    down: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
}, { timestamps: true });

module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema);
