const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/examController');

router.post('/', protect, authorize('admin', 'faculty'), ctrl.createExam);
router.get('/', protect, ctrl.listExams);
router.get('/:id', protect, ctrl.getExam);
router.put('/:id', protect, authorize('admin', 'faculty'), ctrl.updateExam);
router.delete('/:id', protect, authorize('admin', 'faculty'), ctrl.deleteExam);
router.patch('/:id/publish', protect, authorize('admin', 'faculty'), ctrl.publishExam);
router.patch('/:id/questions', protect, authorize('admin', 'faculty'), ctrl.addQuestionToExam);

module.exports = router;
