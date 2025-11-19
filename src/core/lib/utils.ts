import { randomBytes } from 'node:crypto';

export const generateToken = (bytes?: number) => {
  return randomBytes(bytes ?? 32).toString('hex');
};

export const generateOtp = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};
