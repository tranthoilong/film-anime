import crypto from 'crypto';

export function verifyPassword(storedPassword: string, inputPassword: string): boolean {
  const [salt, hash] = storedPassword.split(':');
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === inputHash;
} 