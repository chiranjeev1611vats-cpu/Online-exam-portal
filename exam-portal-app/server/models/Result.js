const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  selectedOption: Number,
}, { _id: false });

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [answerSchema],
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  status: { type: String, enum: ['pass', 'fail'], default: 'fail' },
  startedAt: Date,
  submittedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
