import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { CreateFitnessDto } from './dto/create-fitness.dto';
import { UpdateFitnessDto } from './dto/update-fitness.dto';

@Controller('fitness')
export class FitnessController {
  constructor(private readonly fitnessService: FitnessService) {}

  @Post()
  create(@Body() createFitnessDto: CreateFitnessDto) {
    return this.fitnessService.create(createFitnessDto);
  }

  @Get()
  findAll() {
    return this.fitnessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fitnessService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFitnessDto: UpdateFitnessDto) {
    return this.fitnessService.update(id, updateFitnessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fitnessService.remove(id);
  }
}
