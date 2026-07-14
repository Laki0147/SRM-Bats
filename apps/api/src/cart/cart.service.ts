import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { order: 'asc' }, take: 1 },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { orderBy: { order: 'asc' }, take: 1 } },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return this.formatCart(cart);
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Only ${product.stock} items available`);
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: dto.productId } },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (newQty > product.stock) {
        throw new BadRequestException(`Only ${product.stock} items available`);
      }
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId: dto.productId, quantity: dto.quantity },
      });
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (dto.quantity === 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (dto.quantity > product.stock) {
        throw new BadRequestException(`Only ${product.stock} items available`);
      }
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: dto.quantity },
      });
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCart(userId);
  }

  private formatCart(cart: any) {
    const subtotal = cart.items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0,
    );
    const shipping = subtotal >= 1000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = subtotal + shipping + tax;

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: item.product.price,
          stock: item.product.stock,
          image: item.product.images?.[0] ?? null,
        },
      })),
      summary: {
        subtotal,
        shipping,
        tax,
        total,
        itemCount: cart.items.reduce((s: number, i: any) => s + i.quantity, 0),
      },
    };
  }
}
