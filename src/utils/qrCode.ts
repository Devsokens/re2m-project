import QRCode from 'qrcode';
import { Member } from '../types/member';

/**
 * Generates a high resolution Data URL for the member's QR code.
 * Encodes URL target: /c/[memberId]
 * Allows custom foreground color & background color.
 */
export async function generateMemberQRCodeDataUrl(
  member: Member,
  size: number = 600,
  includeLogo: boolean = true
): Promise<string> {
  const targetUrl = `${window.location.origin}/c/${member.id}`;

  try {
    // Generate base QR code on canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    await QRCode.toCanvas(canvas, targetUrl, {
      width: size,
      margin: 2,
      color: {
        dark: member.qrColor || '#002366',
        light: member.qrBackground || '#FFFFFF'
      },
      errorCorrectionLevel: 'H' // High error correction allows centered logo placement
    });

    if (includeLogo) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw centered logo circle badge
        const center = size / 2;
        const logoSize = size * 0.22;
        const radius = logoSize / 2;

        // Outer white border circle
        ctx.beginPath();
        ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = member.qrBackground || '#FFFFFF';
        ctx.fill();

        // Inner royal blue circle with gold border
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#002366';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#C9A84C';
        ctx.stroke();

        // Draw RE2M text inside logo badge
        ctx.fillStyle = '#C9A84C';
        ctx.font = `bold ${Math.round(logoSize * 0.32)}px 'Playfair Display', serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('RE2M', center, center);
      }
    }

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Error generating QR code:', err);
    // Fallback simple QR URL
    return QRCode.toDataURL(targetUrl, {
      width: size,
      color: {
        dark: member.qrColor || '#002366',
        light: member.qrBackground || '#FFFFFF'
      }
    });
  }
}
