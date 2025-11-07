import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadSingleFile(
    file: Express.Multer.File,
    location: string,
  ): Promise<UploadApiResponse> {
    const uploaded = await this.cloudinaryService.uploadFile(file, location);
    if (!uploaded) throw new BadRequestException('Server side error');
    return uploaded;
  }

  async removeFile(publicId: string) {
    if (!publicId) return;
    return await this.cloudinaryService.deleteFile(publicId);
  }

  parsePublicId(url: string) {
    return url.split('uploads/branch/')[1].split('.')[0];
  }
}
