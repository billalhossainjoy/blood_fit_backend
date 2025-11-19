import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SubscriptionFeaturesService } from './subscription-features.service';
import { CreateSubscriptionFeatureDto } from './dto/create-subscription-feature.dto';
import { UpdateSubscriptionFeatureDto } from './dto/update-subscription-feature.dto';

@Controller('subscription-features')
export class SubscriptionFeaturesController {
  constructor(
    private readonly subscriptionFeaturesService: SubscriptionFeaturesService,
  ) {}

  @Post()
  create(@Body() createSubscriptionFeatureDto: CreateSubscriptionFeatureDto) {
    return this.subscriptionFeaturesService.create(
      createSubscriptionFeatureDto,
    );
  }

  @Get()
  findAll() {
    return this.subscriptionFeaturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionFeaturesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionFeatureDto: UpdateSubscriptionFeatureDto,
  ) {
    return this.subscriptionFeaturesService.update(
      +id,
      updateSubscriptionFeatureDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionFeaturesService.remove(+id);
  }
}
