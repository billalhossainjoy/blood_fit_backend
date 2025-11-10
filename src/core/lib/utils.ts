import { randomBytes } from 'node:crypto';
import { randomInt } from 'crypto';

export const generateToken = (bytes?: number) => {
  return randomBytes(bytes ?? 32).toString();
};

export const generateOtp = (num?: number) => {
  return randomInt(num ?? 6).toString();
};
