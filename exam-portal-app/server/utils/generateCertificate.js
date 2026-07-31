const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Certificate = require('../models/Certificate');

exports.generateCertificateForResult = async (result, user, exam) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const certificateId = 'CERT-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
  const fileName = certificateId + '.pdf';
  const filePath = path.join(uploadsDir, fileName);

  const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1E3A5F');
  doc.fontSize(28).fillColor('#1E3A5F').text('Certificate of Achievement', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(16).fillColor('#333333').text('This certifies that', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(24).fillColor('#000000').text(user.name, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(16).fillColor('#333333').text('has successfully passed the exam "' + exam.title + '"', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(14).text('Score: ' + result.score + ' / ' + result.totalMarks + ' (' + result.percentage.toFixed(1) + '%)', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(12).fillColor('#666666').text('Certificate ID: ' + certificateId, { align: 'center' });
  doc.text('Issue Date: ' + new Date().toDateString(), { align: 'center' });
  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  const certificate = await Certificate.create({
    studentId: user._id,
    examId: exam._id,
    resultId: result._id,
    certificateId,
    fileUrl: '/uploads/' + fileName,
  });
  return certificate;
};
