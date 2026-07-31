const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  resultId: { type: mongoose.Schema.Types.ObjectId, ref: 'Result', required: true, unique: true },
  certificateId: { type: String, required: true, unique: true },
  issueDate: { type: Date, default: Date.now },
  fileUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
