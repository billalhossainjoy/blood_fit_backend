import { Injectable } from '@nestjs/common';
import { CreateSubscriptionFeatureDto } from './dto/create-subscription-feature.dto';
import { UpdateSubscriptionFeatureDto } from './dto/update-subscription-feature.dto';
import { DatabaseService } from '../../../../core/database/database.service';
import { SubscriptionFeatureTable } from './schema/subscription-feature.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SubscriptionFeaturesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createSubscriptionFeatureDto: CreateSubscriptionFeatureDto) {
    const [SubscriptionFeature] = await this.databaseService.db
      .insert(SubscriptionFeatureTable)
      .values(createSubscriptionFeatureDto)
      .returning();
    return SubscriptionFeature;
  }

  async findAll() {
    return this.databaseService.db.select().from(SubscriptionFeatureTable);
  }

  async findOne(id: string) {
    const [SubscriptionFeature] = await this.databaseService.db
      .select()
      .from(SubscriptionFeatureTable)
      .where(eq(SubscriptionFeatureTable.id, id));

    return SubscriptionFeature;
  }

  async update(
    id: string,
    updateSubscriptionFeatureDto: UpdateSubscriptionFeatureDto,
  ) {
    const [SubscriptionFeature] = await this.databaseService.db
      .update(SubscriptionFeatureTable)
      .set(updateSubscriptionFeatureDto)
      .where(eq(SubscriptionFeatureTable.id, id))
      .returning();

    return SubscriptionFeature;
  }

  async remove(id: string) {
    const [SubscriptionFeature] = await this.databaseService.db
      .delete(SubscriptionFeatureTable)
      .where(eq(SubscriptionFeatureTable.id, id))
      .returning();

    return SubscriptionFeature;
  }
}
