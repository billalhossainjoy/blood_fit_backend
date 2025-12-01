import { Module } from '@nestjs/common';
import { MealplanService } from './mealplan.service';
import { MealplanController } from './mealplan.controller';

@Module({
  controllers: [MealplanController],
  providers: [MealplanService],
})
export class MealplanModule {}
