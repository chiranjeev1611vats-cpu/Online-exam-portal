const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/questionController');

router.post('/', protect, authorize('admin', 'faculty'), ctrl.createQuestion);
router.get('/', protect, authorize('admin', 'faculty'), ctrl.listQuestions);
router.put('/:id', protect, authorize('admin', 'faculty'), ctrl.updateQuestion);
router.delete('/:id', protect, authorize('admin', 'faculty'), ctrl.deleteQuestion);

module.exports = router;
