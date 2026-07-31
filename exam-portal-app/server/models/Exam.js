const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  durationMinutes: { type: Number, required: true },
  totalMarks: { type: Number, default: 0 },
  passingMarks: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
