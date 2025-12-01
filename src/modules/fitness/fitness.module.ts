import { Module } from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { FitnessController } from './fitness.controller';

@Module({
  controllers: [FitnessController],
  providers: [FitnessService],
})
export class FitnessModule {}
