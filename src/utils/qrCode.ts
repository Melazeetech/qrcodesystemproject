import QRCode from 'qrcode';

export async function generateQRCodeImage(data: string): Promise<string> {
  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}

export function generateSessionQR(sessionId: string): string {
  const timestamp = Date.now();
  const data = JSON.stringify({
    sessionId,
    timestamp,
    type: 'attendance'
  });
  return btoa(data); // Base64 encode for storage
}

export function validateQRCode(qrCode: string, sessionId: string, maxMinutes: number = 15): boolean {
  try {
    const decoded = atob(qrCode);
    const data = JSON.parse(decoded);
    
    if (data.sessionId !== sessionId || data.type !== 'attendance') return false;
    
    const now = Date.now();
    const diffMinutes = (now - data.timestamp) / (1000 * 60);
    
    return diffMinutes <= maxMinutes;
  } catch {
    return false;
  }
}

export function parseQRCode(qrCodeData: string): { sessionId: string; timestamp: number } | null {
  try {
    const decoded = atob(qrCodeData);
    const data = JSON.parse(decoded);
    
    if (data.type === 'attendance' && data.sessionId && data.timestamp) {
      return {
        sessionId: data.sessionId,
        timestamp: data.timestamp
      };
    }
    return null;
  } catch {
    return null;
  }
}