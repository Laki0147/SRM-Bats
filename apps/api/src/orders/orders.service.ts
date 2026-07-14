import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SRM-${ts}-${rand}`;
  }

  async createOrder(userId: string, dto: CreateOrderDto): Promise<any> {
    // Validate all products and stock
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found or inactive');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        );
      }
    }

    // Calculate totals
    const subtotal = dto.items.reduce((sum, item) => {
      return sum + productMap.get(item.productId).price * item.quantity;
    }, 0);
    const shipping = subtotal >= 1000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = subtotal + shipping + tax;

    // Create order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Decrement stock
      await Promise.all(
        dto.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      // Create the order
      const created = await tx.order.create({
        data: {
          userId,
          orderNumber: this.generateOrderNumber(),
          status: 'PENDING',
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress: dto.shippingAddress as any,
          billingAddress: dto.billingAddress as any,
          paymentMethod: dto.paymentMethod,
          paymentStatus: dto.razorpayPaymentId ? 'PAID' : 'PENDING',
          notes: dto.notes,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId).price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, images: { take: 1 } },
              },
            },
          },
        },
      });

      // Clear user's cart after order placed
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return created;
    });

    return order;
  }

  async getUserOrders(userId: string): Promise<any[]> {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: { take: 1 } },
            },
          },
        },
      },
    });
  }

  async getOrder(userId: string, orderId: string): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { orderBy: { order: 'asc' }, take: 1 },
                specifications: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto, userId: string, isAdmin = false): Promise<any> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status as any },
    });
  }

  async getOrderByNumber(userId: string, orderNumber: string): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { orderBy: { order: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
