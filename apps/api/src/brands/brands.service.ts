import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  async create(dto: CreateBrandDto) {
    const slug = dto.slug?.trim() || this.slugify(dto.name);
    const existing = await this.prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Brand slug '${slug}' already exists`);
    }
    return this.prisma.brand.create({ data: { ...dto, slug } });
  }

  private slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
