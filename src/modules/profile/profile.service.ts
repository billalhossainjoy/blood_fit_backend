import { Injectable } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { DatabaseService } from '../../core/database/database.service';
import { UserTable } from '../user/schema/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { eq } from 'drizzle-orm';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ProfileService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly uploadService: UploadService,
  ) {}
  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    let uploaded: UploadApiResponse | null = null;
    if (file)
      uploaded = await this.uploadService.uploadSingleFile(file, 'avatars');

    const [updatedAvatar] = await this.databaseService.db
      .update(UserTable)
      .set({
        image: uploaded?.publicPath as string,
        ...updateProfileDto,
      })
      .where(eq(UserTable.id, id))
      .returning();

    return updatedAvatar;
  }
}
