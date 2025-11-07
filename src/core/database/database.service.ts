import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from './schema';
import { DATABASE_PROVIDER } from './database.constrants';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DATABASE_PROVIDER)
    public readonly db: NodePgDatabase<typeof schema>,
  ) {}
}
