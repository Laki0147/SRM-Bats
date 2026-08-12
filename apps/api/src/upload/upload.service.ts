import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { extname, join } from 'path';
import { randomBytes } from 'crypto';

/** Minimal shape of a Multer in-memory file (avoids a @types/multer dep). */
export interface UploadedImageFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

@Injectable()
export class UploadService {
  async saveImage(file: UploadedImageFile): Promise<{ url: string }> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException('Only image files (jpeg, png, webp, gif, avif) are allowed');
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = extname(file.originalname) || `.${file.mimetype.split('/')[1]}`;
    const filename = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
    await writeFile(join(UPLOAD_DIR, filename), file.buffer);

    // Served statically by the API at /uploads (see main.ts).
    return { url: `/uploads/${filename}` };
  }
}
