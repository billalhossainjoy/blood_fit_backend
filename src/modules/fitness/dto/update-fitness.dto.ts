import { PartialType } from '@nestjs/swagger';
import { CreateFitnessDto } from './create-fitness.dto';

export class UpdateFitnessDto extends PartialType(CreateFitnessDto) {}
