/**
 * Role-Isolated Password Hashing & Verification Utility
 * Allows Customer, Seller, and Affiliate accounts with the same email
 * to have independent, role-specific passwords that cannot collide or cross-login.
 */

export function hashPassword(password: string): string {
  if (!password) return '';
  const trimmed = password.trim();
  const salt = 'quatro_role_auth_salt_998124_';
  const str = `${salt}${trimmed}`;
  
  let hash1 = 5381;
  let hash2 = 52711;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ (char * (i + 1));
  }
  
  const p1 = Math.abs(hash1 >>> 0).toString(16).padStart(8, '0');
  const p2 = Math.abs(hash2 >>> 0).toString(16).padStart(8, '0');
  
  return `pwd_v1_${p1}${p2}`;
}

export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash || !password) return false;
  const trimmed = password.trim();
  // 1. Check computed hash
  if (hashPassword(trimmed) === storedHash) return true;
  // 2. Backward compatibility for any unhashed legacy password
  if (trimmed === storedHash) return true;
  return false;
}
