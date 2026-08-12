/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, AdminOrdersQueryDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getUserOrders(@Request() req): Promise<any[]> {
    return this.ordersService.getUserOrders(req.user.id);
  }

  // --- Admin routes (declared before ':id' so they aren't shadowed) ---

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  getAllOrders(@Query() query: AdminOrdersQueryDto): Promise<any> {
    return this.ordersService.getAllOrders(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  getOrderAdmin(@Param('id') id: string): Promise<any> {
    return this.ordersService.getOrderAdmin(id);
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  updateStatusAdmin(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto
  ): Promise<any> {
    return this.ordersService.updateOrderStatus(id, dto, req.user.id, true);
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
    @Body() dto: UpdateOrderStatusDto
  ): Promise<any> {
    return this.ordersService.updateOrderStatus(id, dto, req.user.id);
  }
}
