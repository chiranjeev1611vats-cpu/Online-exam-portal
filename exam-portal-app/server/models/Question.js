const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
}, { _id: false });

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'true_false', 'multi_select'], default: 'mcq' },
  options: [optionSchema],
  marks: { type: Number, default: 1 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
