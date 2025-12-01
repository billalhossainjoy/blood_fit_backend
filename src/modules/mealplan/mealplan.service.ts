import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMealplanDto } from './dto/create-mealplan.dto';
import { UpdateMealplanDto } from './dto/update-mealplan.dto';
import { DatabaseService } from '../../core/database/database.service';
import { MealPlanTable } from './schema/mealplan.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MealplanService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createMealplanDto: CreateMealplanDto) {
    const [mealPlan] = await this.databaseService.db
      .insert(MealPlanTable)
      .values(createMealplanDto)
      .returning();

    return mealPlan;
  }

  findAll() {
    return this.databaseService.db.select().from(MealPlanTable);
  }

  async findOne(id: string) {
    const [mealPlan] = await this.databaseService.db
      .select()
      .from(MealPlanTable)
      .where(eq(MealPlanTable.id, id));
    if (!mealPlan) {
      throw new NotFoundException(`MealPlan not found`);
    }
    return mealPlan;
  }

  async update(id: string, updateMealplanDto: UpdateMealplanDto) {
    await this.findOne(id);

    const [mealPlan] = await this.databaseService.db
      .update(MealPlanTable)
      .set(updateMealplanDto)
      .where(eq(MealPlanTable.id, id))
      .returning();

    return mealPlan;
  }

  async remove(id: string) {
    await this.findOne(id);
    const [mealPlan] = await this.databaseService.db
      .delete(MealPlanTable)
      .where(eq(MealPlanTable.id, id))
      .returning();

    return mealPlan;
  }
}
