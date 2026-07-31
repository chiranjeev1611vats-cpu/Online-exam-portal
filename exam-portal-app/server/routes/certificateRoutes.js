const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/certificateController');

router.get('/result/:resultId', protect, ctrl.getCertificateByResult);
router.get('/:id/download', protect, ctrl.downloadCertificate);
router.get('/:id', protect, ctrl.getCertificate);

module.exports = router;
