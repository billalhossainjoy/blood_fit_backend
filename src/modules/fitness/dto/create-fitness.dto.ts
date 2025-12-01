import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt } from 'class-validator';
import {
  ActivityLevel,
  BodyShape,
  FocusBodyArea,
  Goal,
  WorkoutLevel,
} from '../schema/fitness.schema';

export class CreateFitnessDto {
  @ApiProperty({
    description: 'Body shape of the user',
    enum: BodyShape,
    example: BodyShape.Medium,
  })
  @IsEnum(BodyShape)
  bodyShape: BodyShape;

  @ApiProperty({
    description: 'Activity level of the user',
    enum: ActivityLevel,
    example: ActivityLevel.LightActivity,
  })
  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;

  @ApiProperty({
    description: 'Workout level preference',
    enum: WorkoutLevel,
    example: WorkoutLevel.BreakALittleSweat,
  })
  @IsEnum(WorkoutLevel)
  workoutLevel: WorkoutLevel;

  @ApiProperty({
    description: 'Fitness goal',
    enum: Goal,
    example: Goal.GainMuscle,
  })
  @IsEnum(Goal)
  goal: Goal;

  @ApiProperty({
    description: 'Weight of the user in kg',
    example: 70,
  })
  @IsInt()
  weight: number;

  @ApiProperty({
    description: 'Body area the user wants to focus on',
    enum: FocusBodyArea,
    example: FocusBodyArea.Abs,
  })
  @IsEnum(FocusBodyArea)
  focusBodyArea: FocusBodyArea;
}
