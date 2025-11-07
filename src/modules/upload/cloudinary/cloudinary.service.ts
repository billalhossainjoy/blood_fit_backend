import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
    });
  }

  uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | undefined> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder },
        (err, result) => {
          if (err) return reject(new BadRequestException(err.message));
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async deleteFile(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
}
