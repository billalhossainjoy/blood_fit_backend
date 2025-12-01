import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { DatabaseService } from '../../core/database/database.service';
import { SubscriptionTable } from './schema/subscription.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SubscriptionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    console.log(createSubscriptionDto);
    const [subscription] = await this.databaseService.db
      .insert(SubscriptionTable)
      .values({
        ...createSubscriptionDto,
      })
      .returning();

    return subscription;
  }

  findAll() {
    return this.databaseService.db.select().from(SubscriptionTable);
  }

  async findOne(id: string) {
    const [subscription] = await this.databaseService.db
      .select()
      .from(SubscriptionTable)
      .where(eq(SubscriptionTable.id, id));

    return subscription;
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    const [subscription] = await this.databaseService.db
      .update(SubscriptionTable)
      .set({
        ...updateSubscriptionDto,
      })
      .where(eq(SubscriptionTable.id, id))
      .returning();

    return subscription;
  }

  async remove(id: string) {
    const [subscription] = await this.databaseService.db
      .delete(SubscriptionTable)
      .where(eq(SubscriptionTable.id, id))
      .returning();

    return subscription;
  }
}
