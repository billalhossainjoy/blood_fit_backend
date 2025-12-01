import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Diet, WeekDay } from '../schema/mealplan.schema';

export class CreateMealplanDto {
  @ApiProperty({
    description: 'Diet type',
    enum: Diet,
    example: Diet.Classic,
  })
  @IsEnum(Diet)
  diet: Diet;

  @ApiProperty({
    description: 'Days of the week for the meal plan',
    enum: WeekDay,
    isArray: true,
    required: false,
    example: [WeekDay.MON, WeekDay.WED, WeekDay.FRI],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  mealPlanDays?: WeekDay[];

  @ApiProperty({
    description: 'Cheat day for the meal plan',
    enum: WeekDay,
    required: false,
    example: WeekDay.FRI,
  })
  @IsOptional()
  @IsEnum(WeekDay)
  cheatDays?: WeekDay = WeekDay.FRI;

  @ApiProperty({
    description: 'Allergies',
    type: [String],
    required: false,
    example: ['peanut', 'gluten'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Allergies?: string[] = [];

  @ApiProperty({
    description: 'Disliked foods',
    type: [String],
    required: false,
    example: ['broccoli', 'spinach'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dislikes?: string[] = [];
}
