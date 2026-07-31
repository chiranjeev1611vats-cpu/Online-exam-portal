const Question = require('../models/Question');

exports.createQuestion = async (req, res, next) => {
  try {
    const q = await Question.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(q);
  } catch (err) { next(err); }
};

exports.listQuestions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.subject) filter.tags = req.query.subject;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) { next(err); }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(q);
  } catch (err) { next(err); }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) { next(err); }
};
