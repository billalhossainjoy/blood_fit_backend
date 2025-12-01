import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { type User } from '../user/schema/user.schema';
import { ActiveAccount } from '../auth/decorators/active-email.decorator';
import type { Account } from '../auth/schema/account.schema';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@ActiveUser() user: User, @ActiveAccount() account: Account) {
    return {
      ...user,
      isVerified: account.isVerified,
    };
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBody({
    type: UpdateProfileDto,
  })
  async updateProfile(
    @ActiveUser('id') id: string,
    @Body() body: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    console.log(body);
    const data = await this.profileService.update(id, body, file);

    return {
      message: 'Profile updated!',
      data,
    };
  }
}
