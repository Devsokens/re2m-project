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
        const center = size / 2;
        const logoSize = size * 0.22;
        const radius = logoSize / 2;

        // Outer white border circle
        ctx.beginPath();
        ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = member.qrBackground || '#FFFFFF';
        ctx.fill();

        // Load the logo.png image
        const img = new Image();
        img.src = '/logo.png';
        await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });

        if (img.complete && img.naturalWidth > 0) {
          // Clip to circle and draw logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(center, center, radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, center - radius, center - radius, logoSize, logoSize);
          ctx.restore();

          // Draw a thin border around the logo
          ctx.beginPath();
          ctx.arc(center, center, radius, 0, Math.PI * 2);
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#002366';
          ctx.stroke();
        } else {
          // Fallback text logo if image fails to load
          ctx.beginPath();
          ctx.arc(center, center, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#002366';
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#C9A84C';
          ctx.stroke();

          ctx.fillStyle = '#C9A84C';
          ctx.font = `bold ${Math.round(logoSize * 0.32)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('RE2M', center, center);
        }
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
