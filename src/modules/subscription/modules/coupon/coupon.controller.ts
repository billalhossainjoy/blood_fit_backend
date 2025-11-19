import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AllowAnonymous } from '../../../auth/decorators/allow-anonymous.decorator';

@Controller('coupon')
@AllowAnonymous()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async create(@Body() createCouponDto: CreateCouponDto) {
    const coupon = await this.couponService.create(createCouponDto);
    return {
      message: 'Successfully created coupon',
      data: coupon,
    };
  }

  @Get()
  async findAll() {
    const coupons = await this.couponService.findAll();
    return {
      message: 'All coupons',
      data: coupons,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const coupon = await this.couponService.findOne(id);
    return {
      message: 'Successfully finding coupon',
      data: coupon,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    const coupon = await this.couponService.update(id, updateCouponDto);
    return {
      message: 'Successfully updated coupon',
      data: coupon,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponService.remove(id);
    return {
      message: 'Successfully removed coupon',
    };
  }
}
