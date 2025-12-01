import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFitnessDto } from './dto/create-fitness.dto';
import { UpdateFitnessDto } from './dto/update-fitness.dto';
import { DatabaseService } from '../../core/database/database.service';
import { FitnessTable } from './schema/fitness.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class FitnessService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createFitnessDto: CreateFitnessDto) {
    const [fitness] = await this.databaseService.db
      .insert(FitnessTable)
      .values(createFitnessDto)
      .returning();

    return fitness;
  }

  findAll() {
    return this.databaseService.db.select().from(FitnessTable);
  }

  async findOne(id: string) {
    const [fitness] = await this.databaseService.db
      .select()
      .from(FitnessTable)
      .where(eq(FitnessTable.id, id));
    if (!fitness) {
      throw new NotFoundException(`Fitness not found`);
    }
    return fitness;
  }

  async update(id: string, updateFitnessDto: UpdateFitnessDto) {
    await this.findOne(id);

    const [fitness] = await this.databaseService.db
      .update(FitnessTable)
      .set(updateFitnessDto)
      .where(eq(FitnessTable.id, id))
      .returning();

    return fitness;
  }

  async remove(id: string) {
    await this.findOne(id);
    const [fitness] = await this.databaseService.db
      .delete(FitnessTable)
      .where(eq(FitnessTable.id, id))
      .returning();

    return fitness;
  }
}
