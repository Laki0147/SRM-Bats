/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async create(dto: CreateCouponDto) {
    const code = dto.code.trim().toUpperCase();
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new ConflictException(`Coupon code '${code}' already exists`);
    }
    return this.prisma.coupon.create({
      data: this.toData(dto, code),
    });
  }

  async update(id: string, dto: UpdateCouponDto) {
    await this.findOne(id);

    let code: string | undefined;
    if (dto.code !== undefined) {
      code = dto.code.trim().toUpperCase();
      const clash = await this.prisma.coupon.findUnique({ where: { code } });
      if (clash && clash.id !== id) {
        throw new ConflictException(`Coupon code '${code}' already exists`);
      }
    }

    return this.prisma.coupon.update({
      where: { id },
      data: this.toData(dto, code),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.coupon.delete({ where: { id } });
    return { message: 'Coupon deleted' };
  }

  // Builds a Prisma-ready payload: uppercases the code and turns ISO date
  // strings into Date objects. Only defined fields are included.
  private toData(dto: CreateCouponDto | UpdateCouponDto, code?: string): any {
    const data: any = {};
    if (code !== undefined) data.code = code;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.value !== undefined) data.value = dto.value;
    if (dto.minOrder !== undefined) data.minOrder = dto.minOrder;
    if (dto.usageLimit !== undefined) data.usageLimit = dto.usageLimit;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.startsAt !== undefined) {
      data.startsAt = dto.startsAt ? new Date(dto.startsAt) : null;
    }
    if (dto.expiresAt !== undefined) {
      data.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    }
    return data;
  }
}
