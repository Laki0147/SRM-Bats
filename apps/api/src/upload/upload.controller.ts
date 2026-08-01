import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UploadService, UploadedImageFile } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Admin-only image upload. Stored on local disk, served at /uploads/<file>.
  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      // In-memory buffer; the service validates + writes it to disk.
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    })
  )
  uploadImage(@UploadedFile() file: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.uploadService.saveImage(file);
  }
}
