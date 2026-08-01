/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.banner.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({ data: this.toData(dto) });
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.findOne(id);
    return this.prisma.banner.update({ where: { id }, data: this.toData(dto) });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.banner.delete({ where: { id } });
    return { message: 'Banner deleted' };
  }

  // Only defined fields; ISO date strings → Date objects.
  private toData(dto: CreateBannerDto | UpdateBannerDto): any {
    const data: any = {};
    if (dto.heading !== undefined) data.heading = dto.heading;
    if (dto.subtext !== undefined) data.subtext = dto.subtext;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.linkUrl !== undefined) data.linkUrl = dto.linkUrl;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.startsAt !== undefined) {
      data.startsAt = dto.startsAt ? new Date(dto.startsAt) : null;
    }
    if (dto.endsAt !== undefined) {
      data.endsAt = dto.endsAt ? new Date(dto.endsAt) : null;
    }
    return data;
  }
}
