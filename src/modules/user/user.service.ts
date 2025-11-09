import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../../core/database/database.service';
import { UserTable } from './schema/user.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createUserDto: CreateUserDto) {
    return this.databaseService.db
      .insert(UserTable)
      .values({
        ...createUserDto,
      })
      .returning();
  }

  findAll() {
    return this.databaseService.db.query.user.findMany();
  }

  async findOne(id: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, id));

    if (!user) throw new ConflictException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.databaseService.db
      .update(UserTable)
      .set({
        ...updateUserDto,
      })
      .where(eq(UserTable.id, id))
      .returning();
  }

  remove(id: string) {
    return this.databaseService.db
      .delete(UserTable)
      .where(eq(UserTable.id, id))
      .returning();
  }
}
