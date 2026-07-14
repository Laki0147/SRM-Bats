import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getUserOrders(@Request() req): Promise<any[]> {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Request() req, @Body() dto: CreateOrderDto): Promise<any> {
    return this.ordersService.createOrder(req.user.id, dto);
  }

  @Get(':id')
  getOrder(@Request() req, @Param('id') id: string): Promise<any> {
    return this.ordersService.getOrder(req.user.id, id);
  }

  @Get('number/:orderNumber')
  getOrderByNumber(@Request() req, @Param('orderNumber') orderNumber: string): Promise<any> {
    return this.ordersService.getOrderByNumber(req.user.id, orderNumber);
  }

  @Patch(':id/status')
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<any> {
    return this.ordersService.updateOrderStatus(id, dto, req.user.id);
  }
}
