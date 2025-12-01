import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { DatabaseService } from '../../../../core/database/database.service';
import { SubscriptionPlanTable } from './schema/subscription-plan.schema';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class SubscriptionPlanService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    const [subscriptionPlan] = await this.databaseService.db
      .insert(SubscriptionPlanTable)
      .values({
        ...createSubscriptionPlanDto,
      })
      .onConflictDoUpdate({
        target: SubscriptionPlanTable.id,
        set: {
          ...createSubscriptionPlanDto,
        },
      })
      .returning();

    return subscriptionPlan;
  }

  async findAll() {
    return this.databaseService.db.select().from(SubscriptionPlanTable);
  }

  async findOne(id: string) {
    const [subscriptionPlan] = await this.databaseService.db
      .select()
      .from(SubscriptionPlanTable)
      .where(eq(SubscriptionPlanTable.id, id));
    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return subscriptionPlan;
  }

  async update(
    id: string,
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    await this.findOne(id);

    const [subscriptionPlan] = await this.databaseService.db
      .update(SubscriptionPlanTable)
      .set({
        ...updateSubscriptionPlanDto,
      })
      .returning();

    if (!subscriptionPlan) {
      throw new BadRequestException('Server side error');
    }

    return subscriptionPlan;
  }

  async remove(id: string) {
    return this.databaseService.db
      .delete(SubscriptionPlanTable)
      .where(eq(SubscriptionPlanTable.id, id));
  }
}
