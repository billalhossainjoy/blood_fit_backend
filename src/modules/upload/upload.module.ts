import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadConfigService } from './upload.config';
import { UploadService } from './upload.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: UploadConfigService,
    }),
    CloudinaryModule,
  ],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
