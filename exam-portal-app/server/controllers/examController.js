const Exam = require('../models/Exam');

exports.createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(exam);
  } catch (err) { next(err); }
};

exports.listExams = async (req, res, next) => {
  try {
    const filter = req.user.role === 'student' ? { status: 'published' } : {};
    const exams = await Exam.find(filter).populate('createdBy', 'name').populate('questions', 'marks');
    res.json(exams);
  } catch (err) { next(err); }
};

exports.getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions').lean();
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    if (req.user.role === 'student') {
      exam.questions = exam.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        type: q.type,
        marks: q.marks,
        options: q.options.map((o) => ({ text: o.text })),
      }));
    }
    res.json(exam);
  } catch (err) { next(err); }
};

exports.updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exam);
  } catch (err) { next(err); }
};

exports.deleteExam = async (req, res, next) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (err) { next(err); }
};

exports.publishExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    exam.status = exam.status === 'published' ? 'draft' : 'published';
    await exam.save();
    res.json(exam);
  } catch (err) { next(err); }
};

exports.addQuestionToExam = async (req, res, next) => {
  try {
    const { questionId } = req.body;
    let exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { questions: questionId } },
      { new: true }
    ).populate('questions');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    exam.totalMarks = exam.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    if (exam.passingMarks > exam.totalMarks) exam.passingMarks = exam.totalMarks;
    await exam.save();
    res.json(exam);
  } catch (err) { next(err); }
};
