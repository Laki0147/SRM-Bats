/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryProductDto, includeInactive = false) {
    const {
      search,
      category,
      featured,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Admin listings include inactive (soft-deleted) products; public ones don't.
    const where: any = {};
    if (!includeInactive) where.isActive = true;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const validSortFields = ['createdAt', 'price', 'name', 'stock'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { order: 'asc' }, take: 1 },
          specifications: true,
          _count: { select: { reviews: true } },
        },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string, includeInactive = false) {
    const product = await this.prisma.product.findUnique({
      where: includeInactive ? { slug } : { slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' } },
        specifications: true,
        variants: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { firstName: true, lastName: true } } },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product '${slug}' not found`);
    }

    return product;
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' }, take: 1 },
        _count: { select: { reviews: true } },
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const { images, specifications, variants, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        images: images
          ? { create: images.map((img, i) => ({ ...img, order: img.order ?? i })) }
          : undefined,
        specifications: specifications ? { create: specifications } : undefined,
        variants: variants ? { create: variants } : undefined,
      },
      include: {
        images: true,
        specifications: true,
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async update(slug: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException(`Product '${slug}' not found`);

    const { images, specifications, variants, ...productData } = updateProductDto;

    // Nested collections are replaced wholesale when provided so the CMS edit
    // form can add/remove/reorder images and specs. Done in a transaction.
    return this.prisma.$transaction(async (tx) => {
      if (images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: product.id } });
      }
      if (specifications !== undefined) {
        await tx.productSpec.deleteMany({ where: { productId: product.id } });
      }
      if (variants !== undefined) {
        await tx.productVariant.deleteMany({ where: { productId: product.id } });
      }

      return tx.product.update({
        where: { id: product.id },
        data: {
          ...productData,
          ...(images !== undefined
            ? { images: { create: images.map((img, i) => ({ ...img, order: img.order ?? i })) } }
            : {}),
          ...(specifications !== undefined ? { specifications: { create: specifications } } : {}),
          ...(variants !== undefined ? { variants: { create: variants } } : {}),
        },
        include: {
          images: { orderBy: { order: 'asc' } },
          specifications: true,
          variants: true,
          category: { select: { id: true, name: true, slug: true } },
        },
      });
    });
  }

  async remove(slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundException(`Product '${slug}' not found`);

    await this.prisma.product.update({
      where: { id: product.id },
      data: { isActive: false },
    });

    return { message: 'Product deactivated successfully' };
  }
}
