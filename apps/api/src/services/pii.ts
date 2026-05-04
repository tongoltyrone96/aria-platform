export function maskPII(text: string): string {
  return text
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[EMAIL]')
    .replace(/\+?[\d\s\-()×]{7,}\d/g, '[PHONE]')
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, '[CARD]');
}
