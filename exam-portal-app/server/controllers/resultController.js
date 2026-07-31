const Exam = require('../models/Exam');
const Result = require('../models/Result');
const { generateCertificateForResult } = require('../utils/generateCertificate');

exports.submitResult = async (req, res, next) => {
  try {
    const { examId, answers, startedAt } = req.body;
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const started = new Date(startedAt);
    const now = new Date();
    const elapsedMinutes = (now - started) / 60000;
    const withinTime = elapsedMinutes <= exam.durationMinutes + 0.5;

    let score = 0;
    let totalMarks = 0;
    const answerMap = new Map((answers || []).map((a) => [String(a.questionId), a.selectedOption]));

    exam.questions.forEach((q) => {
      totalMarks += q.marks;
      const selected = answerMap.get(String(q._id));
      if (selected === undefined || selected === null) return;
      const correctIndex = q.options.findIndex((o) => o.isCorrect);
      if (Number(selected) === correctIndex) score += q.marks;
    });

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const effectivePassingMarks = Math.min(exam.passingMarks || 0, totalMarks);
    const status = withinTime && score >= effectivePassingMarks ? 'pass' : 'fail';

    const result = await Result.create({
      studentId: req.user._id,
      examId,
      answers,
      score,
      totalMarks,
      percentage,
      status,
      startedAt: started,
      submittedAt: now,
    });

    let certificate = null;
    if (status === 'pass') {
      certificate = await generateCertificateForResult(result, req.user, exam);
    }

    res.status(201).json({ result, certificate });
  } catch (err) { next(err); }
};

exports.getResult = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    if (req.user.role === 'student' && String(result.studentId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const exam = await Exam.findById(result.examId);
    if (exam) {
      const effectivePassingMarks = Math.min(exam.passingMarks || 0, result.totalMarks || 0);
      const nextStatus = result.score >= effectivePassingMarks ? 'pass' : 'fail';
      if (result.status !== nextStatus) {
        result.status = nextStatus;
        await result.save();
      }
    }
    res.json(result);
  } catch (err) { next(err); }
};

exports.getResultsByExam = async (req, res, next) => {
  try {
    const results = await Result.find({ examId: req.params.examId }).populate('studentId', 'name email');
    res.json(results);
  } catch (err) { next(err); }
};

exports.getResultsByStudent = async (req, res, next) => {
  try {
    if (req.user.role === 'student' && req.params.studentId !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const results = await Result.find({ studentId: req.params.studentId }).populate('examId', 'title');
    res.json(results);
  } catch (err) { next(err); }
};
