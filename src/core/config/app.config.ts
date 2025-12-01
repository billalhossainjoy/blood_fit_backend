import { registerAs } from '@nestjs/config';
import { NODE_ENV } from './config.schema';

export default registerAs('app', () => ({
  NODE_ENV: process.env.NODE_ENV as NODE_ENV,
}));
