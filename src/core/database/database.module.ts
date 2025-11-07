import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from './schema';
import { DatabaseService } from './database.service';
import { DATABASE_PROVIDER } from './database.constrants';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_PROVIDER,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString =
          configService.getOrThrow<string>('DATABASE_URL');

        const pool = new Pool({
          connectionString,
        });

        try {
          await pool.query('SELECT 1');
          console.log('Successfully connected to DATABASE');
        } catch (error) {
          console.log('Failed to connect to DATABASE');
          throw error;
        }

        return drizzle(pool, {
          schema,
        });
      },
    },
    DatabaseService,
  ],
  exports: [DATABASE_PROVIDER, DATABASE_PROVIDER],
})
export class DatabaseModule {}
