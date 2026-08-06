/**
 * pdfService.js
 *
 * Generates a professional hospital-style diagnostic PDF report using Puppeteer.
 * The report contains:
 *   - Header with DermaVision branding and Report ID
 *   - Patient information section
 *   - Uploaded skin scan image
 *   - Prediction result card
 *   - Disease overview, symptoms, and causes
 *   - Recommended precautions
 *   - Next recommended steps
 *   - Horizontal AI confidence bar
 *   - Prediction probability bar chart (Chart.js)
 *   - QR Code with report metadata
 *   - Medical disclaimer and professional footer
 */

const puppeteer = require('puppeteer');
const QRCode    = require('qrcode');
const path      = require('path');
const fs        = require('fs');

// ── Ensure reports directory exists ──────────────────────────────────────────
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// ── Colour palette (matches DermaVision frontend) ────────────────────────────
const C = {
  primary:   '#4A9DE8',
  accent:    '#1E3A5F',
  success:   '#34C759',
  warning:   '#F5B942',
  danger:    '#FF4D4F',
  muted:     '#94A3B8',
  light:     '#F7FBFF',
  white:     '#FFFFFF',
  divider:   '#E2E8F0',
};

// ── Helper: map severity to colour ───────────────────────────────────────────
const severityColor = (severity = '') => {
  const s = severity.toLowerCase();
  if (s === 'mild')     return C.success;
  if (s === 'severe' || s === 'critical') return C.danger;
  return C.warning;
};

// ── Helper: build bullet list HTML ───────────────────────────────────────────
const bulletList = (items = [], color = C.primary) =>
  items.length
    ? items
        .map(
          item => `<li style="margin-bottom:6px;padding-left:4px;">
            <span style="color:${color};margin-right:8px;">•</span>${item}
          </li>`
        )
        .join('')
    : `<li style="color:${C.muted}">Not Available</li>`;

// ── Helper: numbered list HTML ────────────────────────────────────────────────
const numberedList = (items = []) =>
  items.length
    ? items
        .map(
          (item, i) => `<li style="margin-bottom:8px;">
            <span style="background:${C.primary};color:#fff;border-radius:50%;
              width:22px;height:22px;display:inline-flex;align-items:center;
              justify-content:center;font-size:11px;font-weight:700;margin-right:10px;
              flex-shrink:0;">${i + 1}</span>${item}
          </li>`
        )
        .join('')
    : `<li style="color:${C.muted}">Not Available</li>`;

/**
 * Main report generator.
 *
 * @param {Object} options
 * @returns {Promise<{ filename, filepath, downloadUrl }>}
 */
const generateReport = async ({
  reportId,
  timestamp,
  patient,
  prediction,
  imageUrl,
  description,
  symptoms,
  possibleCauses,
  homeCare,
  recommendations,
  consultDoctor,
  aiModelsUsed,
  probabilityChart,
}) => {
  // ── 1. Generate QR code (data URL) ─────────────────────────────────────
  const qrData = JSON.stringify({
    reportId,
    patient:   patient.name,
    condition: prediction.condition,
    confidence: prediction.confidence,
    generatedAt: timestamp.toISOString(),
    system: 'DermaVision v1.0',
  });
  const qrDataUrl = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'M',
    width: 140,
    margin: 1,
    color: { dark: C.accent, light: C.white },
  });

  // ── 2. Format date / time ───────────────────────────────────────────────
  const formattedDate = timestamp.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  // ── 3. Build probability chart data JSON (for Chart.js inside the HTML) ─
  const chartLabels = JSON.stringify(probabilityChart.map(p => p.label));
  const chartData   = JSON.stringify(probabilityChart.map(p => p.probability));
  const chartColors = JSON.stringify(
    probabilityChart.map((_, i) => (i === 0 ? C.primary : `${C.primary}${(55 + i * 40).toString(16)}`))
  );

  // ── 4. Build the full HTML template ────────────────────────────────────
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DermaVision Diagnostic Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #ffffff;
      color: ${C.accent};
      font-size: 13px;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 0; }

    /* ── HEADER ── */
    .header {
      background: linear-gradient(135deg, ${C.accent} 0%, #2d5a8e 100%);
      padding: 32px 40px 28px;
      color: white;
    }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-section { display: flex; align-items: center; gap: 14px; }
    .logo-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: rgba(255,255,255,0.18);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 800; color: white;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .logo-text h1 { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .logo-text p  { font-size: 12px; opacity: 0.75; margin-top: 2px; }
    .header-meta { text-align: right; font-size: 11px; opacity: 0.82; line-height: 1.8; }
    .report-id-badge {
      display: inline-block; background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.3); border-radius: 8px;
      padding: 3px 12px; font-size: 11px; font-weight: 700; margin-bottom: 6px;
      font-family: monospace; letter-spacing: 0.5px;
    }
    .header-divider {
      margin-top: 24px; border: none; border-top: 1px solid rgba(255,255,255,0.2);
    }
    .header-subtitle {
      margin-top: 12px; font-size: 13px; font-weight: 600; opacity: 0.85;
      text-align: center; letter-spacing: 0.5px; text-transform: uppercase;
    }

    /* ── CONTENT WRAPPER ── */
    .content { padding: 32px 40px; }

    /* ── SECTION HEADING ── */
    .section-heading {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 16px; padding-bottom: 10px;
      border-bottom: 2px solid ${C.divider};
    }
    .section-heading .icon-badge {
      width: 32px; height: 32px; border-radius: 8px;
      background: ${C.primary}1a; display: flex;
      align-items: center; justify-content: center; font-size: 15px;
    }
    .section-heading h2 {
      font-family: 'Playfair Display', serif; font-size: 16px;
      font-weight: 700; color: ${C.accent};
    }

    /* ── PATIENT INFO ── */
    .patient-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
      margin-bottom: 28px;
    }
    .patient-cell {
      background: ${C.light}; border: 1px solid ${C.divider};
      border-radius: 12px; padding: 14px; text-align: center;
    }
    .patient-cell .label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; color: ${C.muted}; margin-bottom: 6px;
    }
    .patient-cell .value { font-size: 14px; font-weight: 700; color: ${C.accent}; }

    /* ── UPLOADED IMAGE ── */
    .image-container {
      text-align: center; margin-bottom: 28px;
      background: ${C.light}; border: 1px solid ${C.divider};
      border-radius: 16px; padding: 20px;
    }
    .image-container img {
      max-height: 240px; max-width: 100%; object-fit: contain;
      border-radius: 12px; box-shadow: 0 4px 20px rgba(30,58,95,0.12);
    }
    .image-container .img-label {
      margin-top: 10px; font-size: 11px; color: ${C.muted}; font-weight: 600;
    }

    /* ── PREDICTION CARD ── */
    .prediction-card {
      background: linear-gradient(135deg, ${C.accent}08, ${C.primary}0d);
      border: 1.5px solid ${C.primary}33; border-radius: 16px;
      padding: 24px; margin-bottom: 28px;
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
    }
    .pred-item .label {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; color: ${C.muted}; margin-bottom: 5px;
    }
    .pred-item .value { font-size: 20px; font-weight: 800; color: ${C.accent}; }
    .pred-item .value.large { font-size: 24px; font-family: 'Playfair Display', serif; }
    .status-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: #E8F5E9; border: 1px solid #A5D6A7;
      color: #2E7D32; border-radius: 20px; padding: 6px 14px;
      font-size: 12px; font-weight: 700;
    }

    /* ── TWO COLUMN LAYOUT ── */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }

    /* ── CARD ── */
    .card {
      background: ${C.white}; border: 1px solid ${C.divider};
      border-radius: 14px; padding: 20px;
    }
    .card-title {
      font-weight: 700; font-size: 13px; color: ${C.accent};
      margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
    }
    .card-title .dot { width: 8px; height: 8px; border-radius: 50%; background: ${C.primary}; }

    ul.styled { list-style: none; padding: 0; }
    ul.styled li { display: flex; align-items: flex-start; font-size: 12px; color: #475569; }
    ul.numbered { list-style: none; padding: 0; }
    ul.numbered li { display: flex; align-items: flex-start; font-size: 12px; color: #475569; }

    /* ── CONFIDENCE BAR ── */
    .confidence-section { margin-bottom: 28px; }
    .conf-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .conf-label { font-size: 13px; font-weight: 700; color: ${C.accent}; }
    .conf-pct   { font-size: 18px; font-weight: 800; color: ${C.primary}; }
    .conf-track {
      width: 100%; height: 18px; border-radius: 9px;
      background: ${C.divider}; overflow: hidden;
    }
    .conf-fill {
      height: 100%; border-radius: 9px;
      background: linear-gradient(90deg, ${C.primary}, #77B8F5);
    }
    .conf-ticks {
      display: flex; justify-content: space-between;
      margin-top: 5px; font-size: 10px; color: ${C.muted};
    }

    /* ── CHART ── */
    .chart-section { margin-bottom: 28px; }
    .chart-wrap { padding: 16px; background: ${C.light}; border-radius: 14px; border: 1px solid ${C.divider}; }

    /* ── QR + NEXT STEPS ── */
    .bottom-row { display: grid; grid-template-columns: 1fr auto; gap: 24px; margin-bottom: 28px; }
    .qr-block {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 20px; background: ${C.light}; border: 1px solid ${C.divider}; border-radius: 14px;
    }
    .qr-block img { width: 110px; height: 110px; }
    .qr-block p { font-size: 10px; color: ${C.muted}; margin-top: 8px; text-align: center; font-weight: 600; }

    /* ── DISCLAIMER ── */
    .disclaimer {
      background: #FFF8E1; border: 1px solid #FFE082; border-radius: 12px;
      padding: 16px 20px; margin-bottom: 24px;
      font-size: 11px; color: #7B5E00; line-height: 1.7; font-style: italic;
    }
    .disclaimer strong { font-style: normal; }

    /* ── FOOTER ── */
    .footer {
      border-top: 1px solid ${C.divider}; padding: 16px 40px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; color: ${C.muted};
      background: ${C.light};
    }
    .footer strong { color: ${C.accent}; }

    /* ── PAGE BREAK ── */
    @media print {
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ -->
  <div class="header">
    <div class="header-top">
      <div class="logo-section">
        <div class="logo-icon">DV</div>
        <div class="logo-text">
          <h1>DermaVision</h1>
          <p>AI-Powered Dermatological Screening System</p>
        </div>
      </div>
      <div class="header-meta">
        <div class="report-id-badge">${reportId}</div><br/>
        <span>📅 ${formattedDate}</span><br/>
        <span>🕐 ${formattedTime}</span><br/>
        <span>🤖 AI Model Version: 1.0</span>
      </div>
    </div>
    <hr class="header-divider" />
    <p class="header-subtitle">AI Skin Disease Screening — Diagnostic Report</p>
  </div>

  <!-- ═══════════════════════════════════════ CONTENT ════════════════════════════════════ -->
  <div class="content">

    <!-- ── PATIENT INFORMATION ── -->
    <div class="section-heading">
      <div class="icon-badge">👤</div>
      <h2>Patient Information</h2>
    </div>
    <div class="patient-grid">
      <div class="patient-cell">
        <div class="label">Patient Name</div>
        <div class="value">${patient.name}</div>
      </div>
      <div class="patient-cell">
        <div class="label">Age</div>
        <div class="value">${patient.age}</div>
      </div>
      <div class="patient-cell">
        <div class="label">Gender</div>
        <div class="value">${patient.gender}</div>
      </div>
      <div class="patient-cell">
        <div class="label">Patient ID</div>
        <div class="value" style="font-family:monospace;font-size:12px;">${patient.patientId}</div>
      </div>
    </div>

    <!-- ── UPLOADED IMAGE ── -->
    ${imageUrl ? `
    <div class="section-heading">
      <div class="icon-badge">📷</div>
      <h2>Uploaded Skin Scan</h2>
    </div>
    <div class="image-container">
      <img src="${imageUrl}" alt="Uploaded Skin Scan" />
      <p class="img-label">Original Uploaded Image — Analysed by DermaVision AI</p>
    </div>
    ` : ''}

    <!-- ── PREDICTION RESULT ── -->
    <div class="section-heading">
      <div class="icon-badge">🔬</div>
      <h2>Prediction Result</h2>
    </div>
    <div class="prediction-card">
      <div class="pred-item">
        <div class="label">Predicted Disease</div>
        <div class="value large">${prediction.condition}</div>
      </div>
      <div class="pred-item">
        <div class="label">Confidence Score</div>
        <div class="value" style="color:${C.primary};">${parseFloat(prediction.confidence).toFixed(1)}%</div>
      </div>
      <div class="pred-item">
        <div class="label">Risk Level</div>
        <div class="value" style="color:${severityColor(prediction.severity)};">${prediction.severity}</div>
      </div>
      <div class="pred-item">
        <div class="label">Prediction Status</div>
        <div class="status-badge">✅ AI Screening Completed Successfully</div>
      </div>
      <div class="pred-item">
        <div class="label">Affected Area</div>
        <div class="value" style="font-size:16px;">${prediction.affectedArea || 'N/A'}</div>
      </div>
      <div class="pred-item">
        <div class="label">Body Location</div>
        <div class="value" style="font-size:14px;">${prediction.bodyPart || 'Skin Surface'}</div>
      </div>
    </div>

    <!-- ── DISEASE DESCRIPTION ── -->
    <div class="section-heading">
      <div class="icon-badge">📋</div>
      <h2>Disease Information</h2>
    </div>
    <div class="card" style="margin-bottom:20px;">
      <div class="card-title"><div class="dot"></div> Overview</div>
      <p style="font-size:12px;color:#475569;line-height:1.8;">${description || 'No description available.'}</p>
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-title"><div class="dot" style="background:#EF4444;"></div> Common Symptoms</div>
        <ul class="styled">${bulletList(symptoms, '#EF4444')}</ul>
      </div>
      <div class="card">
        <div class="card-title"><div class="dot" style="background:#F59E0B;"></div> Possible Causes</div>
        <ul class="styled">${bulletList(possibleCauses, '#F59E0B')}</ul>
      </div>
    </div>

    <!-- ── RECOMMENDED PRECAUTIONS ── -->
    <div class="section-heading">
      <div class="icon-badge">🛡️</div>
      <h2>Recommended Precautions</h2>
    </div>
    <div class="card" style="margin-bottom:28px;">
      <ul class="styled">${bulletList(recommendations, C.primary)}</ul>
    </div>

    <!-- ── HOME CARE ── -->
    ${homeCare.length ? `
    <div class="section-heading">
      <div class="icon-badge">🏠</div>
      <h2>Home Care Tips</h2>
    </div>
    <div class="card" style="margin-bottom:28px;">
      <ul class="styled">${bulletList(homeCare, C.success)}</ul>
    </div>
    ` : ''}

    <!-- ── NEXT RECOMMENDED STEPS ── -->
    <div class="section-heading">
      <div class="icon-badge">📌</div>
      <h2>Next Recommended Steps</h2>
    </div>
    <div class="card" style="margin-bottom:28px;">
      <ul class="numbered">
        ${numberedList([
          'Schedule a consultation with a qualified dermatologist for clinical evaluation.',
          'Laboratory skin tests or biopsy if recommended by your physician.',
          'Continue monitoring symptoms and document any changes.',
          'Avoid self-medication; only use prescribed topical treatments.',
          'Seek immediate medical care if symptoms worsen rapidly.',
        ])}
      </ul>
    </div>

    <!-- ── AI CONFIDENCE VISUALISATION ── -->
    <div class="section-heading">
      <div class="icon-badge">📊</div>
      <h2>AI Confidence Visualisation</h2>
    </div>
    <div class="confidence-section card">
      <div class="conf-header">
        <span class="conf-label">Prediction Confidence: ${prediction.condition}</span>
        <span class="conf-pct">${parseFloat(prediction.confidence).toFixed(1)}%</span>
      </div>
      <div class="conf-track">
        <div class="conf-fill" style="width:${parseFloat(prediction.confidence).toFixed(1)}%;"></div>
      </div>
      <div class="conf-ticks">
        <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
      </div>
    </div>

    <!-- ── PROBABILITY CHART ── -->
    <div class="section-heading" style="margin-top:24px;">
      <div class="icon-badge">📈</div>
      <h2>Prediction Probability Chart</h2>
    </div>
    <div class="chart-section chart-wrap">
      <canvas id="probChart" height="130"></canvas>
    </div>

    <!-- ── QR CODE + AI MODELS ── -->
    <div class="bottom-row" style="margin-top:28px;">
      <div class="card">
        <div class="card-title"><div class="dot"></div> AI Models Used</div>
        <ul class="styled">
          ${(aiModelsUsed.length
              ? aiModelsUsed
              : ['EfficientNet-B4 (Classification)', 'U-Net (Lesion Segmentation)', 'Grad-CAM (Explainable AI)']
            ).map(m => `<li style="margin-bottom:6px;padding-left:4px;"><span style="color:${C.primary};margin-right:8px;">✓</span>${m}</li>`).join('')}
        </ul>
      </div>
      <div class="qr-block">
        <img src="${qrDataUrl}" alt="QR Code" />
        <p>Scan to verify<br/>report authenticity</p>
      </div>
    </div>

    <!-- ── DISCLAIMER ── -->
    <div class="disclaimer">
      <strong>⚠️ Medical Disclaimer:</strong>
      This report is generated by the DermaVision AI Skin Disease Screening System for informational
      purposes only. It is <strong>not a medical diagnosis</strong> and should not replace consultation
      with a qualified healthcare professional. Always seek the advice of a licensed dermatologist or
      physician for professional medical advice, diagnosis, and treatment.
    </div>

  </div><!-- /content -->

  <!-- ═══════════════════════════════════════ FOOTER ════════════════════════════════════ -->
  <div class="footer">
    <div>Generated by <strong>DermaVision</strong> — AI Skin Screening System &nbsp;|&nbsp; Version 1.0</div>
    <div>dermavision.ai &nbsp;|&nbsp; Report ID: <strong>${reportId}</strong></div>
  </div>

</div><!-- /page -->

<script>
  // Render probability bar chart after DOM loads
  window.addEventListener('load', function () {
    const ctx = document.getElementById('probChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ${chartLabels},
        datasets: [{
          label: 'Prediction Probability (%)',
          data: ${chartData},
          backgroundColor: ${chartColors},
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.parsed.x.toFixed(1) + '%'
            }
          }
        },
        scales: {
          x: {
            min: 0, max: 100,
            ticks: { callback: v => v + '%', font: { size: 11 } },
            grid: { color: '#E2E8F044' }
          },
          y: { ticks: { font: { size: 12, weight: '600' } }, grid: { display: false } }
        }
      }
    });
  });
</script>
</body>
</html>`;

  // ── 5. Launch Puppeteer and render PDF ─────────────────────────────────
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  try {
    const page = await browser.newPage();

    // Set content and wait for Chart.js + fonts to fully render
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

    // Extra wait to ensure Chart.js canvas rendering completes
    await new Promise(r => setTimeout(r, 800));

    // Build unique filename
    const dateStr   = timestamp.toISOString().split('T')[0];
    const filename  = `DermaVision_Report_${dateStr}_${reportId}.pdf`;
    const filepath  = path.join(reportsDir, filename);

    await page.pdf({
      path:   filepath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    const downloadUrl = `/reports/${filename}`;
    return { filename, filepath, downloadUrl };
  } finally {
    await browser.close();
  }
};

module.exports = { generateReport };
