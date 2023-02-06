import { randomBytes, pbkdf2Sync } from 'node:crypto';

// this can only be used server-side

export function generateRandom(size = 32): string {
    if (!Number.isInteger(size)) size = 32;
    return randomBytes(size).toString('hex');
}

export function hashPassword(password: string, salt: string): string | null {
    if (!password || !salt) return null;
    return pbkdf2Sync(password, salt, 10000, 128, 'sha512').toString('hex');
}
