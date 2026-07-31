const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/resultController');

router.post('/submit', protect, authorize('student'), ctrl.submitResult);
router.get('/:id', protect, ctrl.getResult);
router.get('/exam/:examId', protect, authorize('admin', 'faculty'), ctrl.getResultsByExam);
router.get('/student/:studentId', protect, ctrl.getResultsByStudent);

module.exports = router;
