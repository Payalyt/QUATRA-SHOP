/**
 * 8-Digit Unique ID Utility for Customers and Sellers
 * Ensures ONLY 8-digit numbers (e.g. 48291048, 82910482) without text prefixes.
 */

export function generate8DigitNumber(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const num = (array[0] % 90000000) + 10000000;
    return num.toString();
  }
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

/**
 * Extracts pure 8-digit numeric ID from any string, stripping prefixes like QA-, QA-SL-, usr- etc.
 */
export function cleanQAId(rawId?: string): string {
  if (!rawId) return generate8DigitNumber();
  // Extract all digits
  const digits = rawId.replace(/\D/g, '');
  if (digits.length === 8) {
    return digits;
  }
  if (digits.length > 8) {
    return digits.slice(-8);
  }
  if (digits.length > 0) {
    return digits.padStart(8, '0');
  }
  return generate8DigitNumber();
}

/**
 * Generate a clean 8-digit Customer ID (e.g. 48291048)
 */
export function generateCustomerQAId(): string {
  return generate8DigitNumber();
}

/**
 * Generate a clean 8-digit Seller ID (e.g. 82910482)
 */
export function generateSellerQAId(): string {
  return generate8DigitNumber();
}

/**
 * Ensures an ID is a clean 8-digit number string without text prefixes.
 */
export function ensureCustomerQAId(existingId?: string): string {
  return cleanQAId(existingId);
}

export function ensureSellerQAId(existingId?: string): string {
  return cleanQAId(existingId);
}
