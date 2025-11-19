import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../core/database/database.service';
import { CouponTable } from './schema/coupon.schema';
import { eq } from 'drizzle-orm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCouponDto: CreateCouponDto) {
    const [user] = await this.databaseService.db
      .insert(CouponTable)
      .values(createCouponDto)
      .returning();

    return user;
  }

  findAll() {
    return this.databaseService.db.select().from(CouponTable);
  }

  async findOne(id: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(CouponTable)
      .where(eq(CouponTable.id, id));
    return user;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const [user] = await this.databaseService.db
      .update(CouponTable)
      .set(updateCouponDto)
      .where(eq(CouponTable.id, id))
      .returning();

    return user;
  }

  async remove(id: string) {
    const [user] = await this.databaseService.db
      .delete(CouponTable)
      .where(eq(CouponTable.id, id))
      .returning();

    return user;
  }
}
