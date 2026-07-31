const path = require('path');
const Certificate = require('../models/Certificate');

exports.getCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    if (req.user.role === 'student' && String(cert.studentId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(cert);
  } catch (err) { next(err); }
};

exports.getCertificateByResult = async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({ resultId: req.params.resultId });
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    if (req.user.role === 'student' && String(cert.studentId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(cert);
  } catch (err) { next(err); }
};

exports.downloadCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    if (req.user.role === 'student' && String(cert.studentId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const filePath = path.join(__dirname, '..', cert.fileUrl);
    res.download(filePath);
  } catch (err) { next(err); }
};
