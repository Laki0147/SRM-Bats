import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const order = await this.ordersService.findOne(createPaymentDto.orderId);

    const payment = await this.prisma.payment.create({
      data: {
        orderId: createPaymentDto.orderId,
        amount: order.totalAmount,
        method: createPaymentDto.method,
        status: 'PENDING',
      },
    });

    await this.ordersService.update(createPaymentDto.orderId, {
      status: 'PROCESSING',
    });

    return payment;
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);

    const payment = await this.prisma.payment.update({
      where: { id },
      data: { status },
    });

    if (status === 'COMPLETED') {
      await this.ordersService.update(payment.orderId, {
        status: 'PROCESSING',
      });
    }

    return payment;
  }
}
