import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES ?? '3600', 10),
  refreshExpiresIn: parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRES ?? '86400',
    10,
  ),
  issuer: process.env.ISSUER,
  audience: process.env.AUDIENCE,
}));
