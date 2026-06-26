const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLOR = {
  primary:    '#1A237E',   // deep navy   – header / section titles
  accent:     '#0288D1',   // sky blue    – labels
  dark:       '#212121',   // near-black  – body text
  muted:      '#757575',   // grey        – secondary text / disclaimer
  divider:    '#CFD8DC',   // light grey  – horizontal rules
  warning:    '#E65100',   // orange      – high severity
  success:    '#2E7D32',   // green       – low severity
  white:      '#FFFFFF',
};

// ─── Layout constants ─────────────────────────────────────────────────────────
const MARGIN        = 50;
const PAGE_WIDTH    = 595.28;   // A4
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Draw a full-width horizontal rule */
const drawRule = (doc, y, color = COLOR.divider) => {
  doc
    .moveTo(MARGIN, y)
    .lineTo(PAGE_WIDTH - MARGIN, y)
    .strokeColor(color)
    .lineWidth(0.5)
    .stroke();
};

/** Render a section heading with a coloured left bar */
const sectionHeading = (doc, title) => {
  doc.moveDown(0.8);
  const y = doc.y;

  // Left accent bar
  doc
    .rect(MARGIN, y, 4, 14)
    .fill(COLOR.accent);

  doc
    .fillColor(COLOR.primary)
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(title, MARGIN + 12, y + 1);

  doc.moveDown(0.5);
  drawRule(doc, doc.y);
  doc.moveDown(0.5);
};

/** Render a labelled value row */
const labelValue = (doc, label, value, valueColor = COLOR.dark) => {
  const startY = doc.y;
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(COLOR.accent)
    .text(`${label}:`, MARGIN, startY, { continued: true, width: 140 });

  doc
    .font('Helvetica')
    .fillColor(valueColor)
    .text(` ${value}`, { width: CONTENT_WIDTH - 140 });

  doc.moveDown(0.3);
};

/** Render a bullet list */
const bulletList = (doc, items) => {
  items.forEach((item) => {
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(COLOR.dark)
      .text(`• ${item}`, MARGIN + 10, doc.y, { width: CONTENT_WIDTH - 10 });
    doc.moveDown(0.25);
  });
};

/** Choose severity colour */
const severityColor = (severity) => {
  const s = (severity || '').toLowerCase();
  if (s === 'mild')     return COLOR.success;
  if (s === 'severe')   return COLOR.warning;
  return COLOR.accent;   // moderate
};

// ─── Main service function ────────────────────────────────────────────────────

/**
 * Generate a DermaVision PDF screening report.
 *
 * FUTURE COMPATIBILITY — extend the `options` object with:
 *   options.imagePath      – uploaded skin image
 *   options.gradCamPath    – Grad-CAM overlay image
 *   options.logoPath       – hospital / clinic logo
 *   options.qrCodePath     – QR code image
 *   options.doctorName     – doctor signature line
 *   options.modelVersion   – AI model version string
 *   options.processingTime – inference duration (ms)
 *
 * The controller does not need to change; just pass extras in options.
 *
 * @param {Object} prediction   – { condition, confidence, severity }
 * @param {Object} recommendation – full recommendation object
 * @param {Object} [options={}] – future extension fields
 * @returns {Promise<{ filename, filepath, downloadUrl }>}
 */
const generateReport = ({ prediction, recommendation, options = {} }) => {
  return new Promise((resolve, reject) => {
    try {
      // Build unique filename
      const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const timestamp = Date.now();
      const filename = `DermaVision_Report_${dateStr}_${timestamp}.pdf`;
      const filepath = path.join(reportsDir, filename);
      const downloadUrl = `/reports/${filename}`;

      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        info: {
          Title:    'DermaVision AI Skin Screening Report',
          Author:   'DermaVision',
          Subject:  `Screening Report – ${prediction.condition}`,
          Creator:  'DermaVision PDF Service',
        },
      });

      const writeStream = fs.createWriteStream(filepath);
      doc.pipe(writeStream);

      // ── HEADER BANNER ───────────────────────────────────────────────────────
      doc
        .rect(0, 0, PAGE_WIDTH, 90)
        .fill(COLOR.primary);

      doc
        .fillColor(COLOR.white)
        .font('Helvetica-Bold')
        .fontSize(24)
        .text('DermaVision', MARGIN, 20, { align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#B3C4F5')
        .text('AI Skin Condition Screening Report', MARGIN, 50, { align: 'center' });

      // Generated date / time (below header)
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });

      doc
        .fillColor(COLOR.muted)
        .font('Helvetica')
        .fontSize(9)
        .text(`Generated: ${formattedDate}  •  ${formattedTime}`, MARGIN, 100, {
          align: 'right',
          width: CONTENT_WIDTH,
        });

      doc.moveDown(1.5);

      // ── PREDICTION SUMMARY ──────────────────────────────────────────────────
      sectionHeading(doc, 'Prediction Summary');

      labelValue(doc, 'Condition',  prediction.condition);
      labelValue(doc, 'Confidence', `${prediction.confidence}%`);
      labelValue(
        doc,
        'Severity',
        prediction.severity,
        severityColor(prediction.severity)
      );

      // ── DISEASE INFORMATION ─────────────────────────────────────────────────
      sectionHeading(doc, 'Disease Information');

      // Description
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(COLOR.accent)
        .text('Description:', MARGIN);
      doc.moveDown(0.2);
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(COLOR.dark)
        .text(recommendation.description || '—', MARGIN, doc.y, { width: CONTENT_WIDTH });
      doc.moveDown(0.6);

      // Symptoms
      if (recommendation.symptoms?.length) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR.accent).text('Symptoms:');
        doc.moveDown(0.2);
        bulletList(doc, recommendation.symptoms);
        doc.moveDown(0.4);
      }

      // Causes
      if (recommendation.causes?.length) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR.accent).text('Causes:');
        doc.moveDown(0.2);
        bulletList(doc, recommendation.causes);
        doc.moveDown(0.4);
      }

      // Precautions
      if (recommendation.precautions?.length) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR.accent).text('Precautions:');
        doc.moveDown(0.2);
        bulletList(doc, recommendation.precautions);
        doc.moveDown(0.4);
      }

      // Home Care
      if (recommendation.homeCare?.length) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor(COLOR.accent).text('Home Care:');
        doc.moveDown(0.2);
        bulletList(doc, recommendation.homeCare);
        doc.moveDown(0.4);
      }

      // ── RECOMMENDATION BOX ──────────────────────────────────────────────────
      sectionHeading(doc, 'Recommendation');

      const consultText = recommendation.consultDermatologist
        ? '✔  Dermatologist consultation is recommended.'
        : '✔  Continue monitoring the condition.';

      const boxColor = recommendation.consultDermatologist ? '#FFF3E0' : '#E8F5E9';
      const textColor = recommendation.consultDermatologist ? COLOR.warning : COLOR.success;
      const boxY = doc.y;

      doc.rect(MARGIN, boxY, CONTENT_WIDTH, 30).fill(boxColor);
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor(textColor)
        .text(consultText, MARGIN + 10, boxY + 9, { width: CONTENT_WIDTH - 20 });

      doc.moveDown(2.5);

      // ── DISCLAIMER ──────────────────────────────────────────────────────────
      drawRule(doc, doc.y, COLOR.muted);
      doc.moveDown(0.5);

      doc
        .font('Helvetica-Oblique')
        .fontSize(8.5)
        .fillColor(COLOR.muted)
        .text(
          'This report is generated by an AI-assisted skin screening application.\n' +
          'It is intended only for educational purposes and is NOT a medical diagnosis.\n' +
          'Please consult a qualified dermatologist for professional medical advice.',
          MARGIN,
          doc.y,
          { width: CONTENT_WIDTH, align: 'center' }
        );

      // ── FOOTER ──────────────────────────────────────────────────────────────
      const footerY = doc.page.height - MARGIN - 15;
      drawRule(doc, footerY - 6, COLOR.divider);
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR.muted)
        .text('© DermaVision  |  AI-Powered Skin Screening', MARGIN, footerY, {
          width: CONTENT_WIDTH,
          align: 'center',
        });

      // ── FINALISE ────────────────────────────────────────────────────────────
      doc.end();

      writeStream.on('finish', () => resolve({ filename, filepath, downloadUrl }));
      writeStream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateReport };
