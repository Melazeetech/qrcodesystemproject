export function generateQRCode(sessionId: string, timestamp: number): string {
  // In a real implementation, this would generate an actual QR code
  // For demo purposes, we'll create a unique string
  const data = `${sessionId}_${timestamp}`;
  return btoa(data);
}

export function validateQRCode(qrCode: string, sessionId: string, maxMinutes: number = 15): boolean {
  try {
    const decoded = atob(qrCode);
    const [id, timestamp] = decoded.split('_');
    
    if (id !== sessionId) return false;
    
    const now = Date.now();
    const qrTimestamp = parseInt(timestamp);
    const diffMinutes = (now - qrTimestamp) / (1000 * 60);
    
    return diffMinutes <= maxMinutes;
  } catch {
    return false;
  }
}

export function generateSessionQR(sessionId: string): string {
  const timestamp = Date.now();
  return generateQRCode(sessionId, timestamp);
}