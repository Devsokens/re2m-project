import { Member } from '../types/member';
import { generateMemberQRCodeDataUrl } from './qrCode';
import jsPDF from 'jspdf';

/**
 * Triggers standard browser window print for 85x54mm business card
 */
export function printMemberCard(): void {
  window.print();
}

/**
 * Generates an HD PDF download (85x54 mm standard business card size + bleed)
 * with Recto (Front) and Verso (Back) in Bleu Royal & White theme
 */
export async function downloadMemberPDF(member: Member): Promise<void> {
  // Dimensions in millimeters for standard CR80 business card
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85, 54]
  });

  // PAGE 1: RECTO (Front Side)
  // Background Royal Blue
  doc.setFillColor(0, 35, 102); // #002366
  doc.rect(0, 0, 85, 54, 'F');

  // Sky blue accent lines top & bottom
  doc.setDrawColor(147, 197, 253); // #93C5FD
  doc.setLineWidth(0.8);
  doc.line(4, 4, 81, 4);
  doc.line(4, 50, 81, 50);

  // Header Brand
  doc.setTextColor(147, 197, 253);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CABINET RE2M', 8, 10);

  // Member Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  const fullName = `${member.civility ? member.civility + ' ' : ''}${member.firstName} ${member.lastName.toUpperCase()}`;
  doc.text(fullName, 8, 17);

  // Member Title
  doc.setTextColor(147, 197, 253);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(member.title, 8, 21);

  // Department Badge
  doc.setFillColor(26, 76, 140);
  doc.roundedRect(8, 23.5, 30, 4, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(5.5);
  doc.text(member.department.toUpperCase(), 10, 26.2);

  // Contact Info Section
  doc.setTextColor(220, 230, 245);
  doc.setFontSize(6);
  doc.text(`Mobile: ${member.mobile}`, 8, 32);
  doc.text(`Email: ${member.email}`, 8, 36);
  if (member.phone) {
    doc.text(`Fixe: ${member.phone}`, 8, 40);
  }
  doc.text(`Adresse: ${member.address}`, 8, 44);

  // Front QR Code watermark preview
  const qrDataUrl = await generateMemberQRCodeDataUrl(member, 400, true);
  doc.addImage(qrDataUrl, 'PNG', 60, 25, 20, 20);

  // PAGE 2: VERSO (Back Side)
  doc.addPage([85, 54], 'landscape');

  // Background Dark Royal Blue
  doc.setFillColor(8, 16, 38);
  doc.rect(0, 0, 85, 54, 'F');

  // Sky blue border frame
  doc.setDrawColor(147, 197, 253);
  doc.setLineWidth(0.5);
  doc.rect(3, 3, 79, 48);

  // Large Centered QR Code
  doc.addImage(qrDataUrl, 'PNG', 27.5, 7, 30, 30);

  // Brand Slogan & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('RE2M CONNECT', 42.5, 41, { align: 'center' });

  doc.setTextColor(147, 197, 253);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Scannez pour accéder au profil digital & vCard', 42.5, 45, { align: 'center' });

  // Save PDF
  doc.save(`Carte_RE2M_${member.firstName}_${member.lastName}.pdf`);
}
