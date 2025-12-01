import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export default registerAs('revenue-cat', () => ({
  apiKey: z.string().parse(process.env.REVENUECAT_API_KEY),
  baseUrl: z.string().parse(process.env.REVENUECAT_BASE_URL),
}));
