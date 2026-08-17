import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import React from 'react';
import { CertificateTemplate, CertificateData, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT } from '../components/admin/certificates/CertificateTemplate';

// Renders a <CertificateTemplate> off-screen and rasterizes it to a PNG data URL via html2canvas.
async function renderCertificateToDataUrl(data: CertificateData): Promise<string> {
  const html2canvas = (await import('html2canvas')).default;

  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-99999px';
  host.style.top = '0';
  document.body.appendChild(host);

  const root = createRoot(host);
  root.render(React.createElement(CertificateTemplate, data));

  // Let React commit + images load
  await new Promise((resolve) => setTimeout(resolve, 150));

  const target = host.firstElementChild as HTMLElement;
  const canvas = await html2canvas(target, {
    width: CERTIFICATE_WIDTH,
    height: CERTIFICATE_HEIGHT,
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  });

  root.unmount();
  document.body.removeChild(host);

  return canvas.toDataURL('image/png');
}

function dataUrlToPdf(dataUrl: string): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT] });
  doc.addImage(dataUrl, 'PNG', 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);
  return doc;
}

const safeFileName = (name: string) => name.replace(/[^\p{L}\p{N}]+/gu, '_');

export async function downloadSingleCertificate(data: CertificateData): Promise<void> {
  const dataUrl = await renderCertificateToDataUrl(data);
  const doc = dataUrlToPdf(dataUrl);
  doc.save(`Attestation_${safeFileName(data.participantName)}.pdf`);
}

export async function previewCertificateDataUrl(data: CertificateData): Promise<string> {
  return renderCertificateToDataUrl(data);
}

// One merged PDF, one page per participant
export async function downloadMergedCertificatesPdf(items: CertificateData[], fileName = 'Attestations.pdf'): Promise<void> {
  let doc: jsPDF | null = null;
  for (let i = 0; i < items.length; i++) {
    const dataUrl = await renderCertificateToDataUrl(items[i]);
    if (!doc) {
      doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT] });
    } else {
      doc.addPage([CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT], 'landscape');
    }
    doc.addImage(dataUrl, 'PNG', 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);
  }
  doc?.save(fileName);
}

// One ZIP archive containing one PDF per participant
export async function downloadCertificatesZip(items: CertificateData[], fileName = 'Attestations.zip'): Promise<void> {
  const zip = new JSZip();
  for (const item of items) {
    const dataUrl = await renderCertificateToDataUrl(item);
    const doc = dataUrlToPdf(dataUrl);
    const blob = doc.output('blob');
    zip.file(`Attestation_${safeFileName(item.participantName)}.pdf`, blob);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
