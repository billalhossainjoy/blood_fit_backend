import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MealplanService } from './mealplan.service';
import { CreateMealplanDto } from './dto/create-mealplan.dto';
import { UpdateMealplanDto } from './dto/update-mealplan.dto';

@Controller('mealplan')
export class MealplanController {
  constructor(private readonly mealplanService: MealplanService) {}

  @Post()
  create(@Body() createMealplanDto: CreateMealplanDto) {
    return this.mealplanService.create(createMealplanDto);
  }

  @Get()
  findAll() {
    return this.mealplanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealplanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMealplanDto: UpdateMealplanDto,
  ) {
    return this.mealplanService.update(id, updateMealplanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mealplanService.remove(id);
  }
}
