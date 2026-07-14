import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CreatePaymentOrderDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  receipt?: string;
}

class VerifyPaymentDto {
  @IsString()
  razorpayOrderId: string;

  @IsString()
  razorpayPaymentId: string;

  @IsString()
  razorpaySignature: string;
}

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Request() req, @Body() dto: CreatePaymentOrderDto) {
    return this.paymentService.createRazorpayOrder(
      dto.amount,
      dto.currency,
      dto.receipt,
    );
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    const isValid = this.paymentService.verifyPaymentSignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );

    if (!isValid) {
      throw new BadRequestException('Payment verification failed');
    }

    return { verified: true, paymentId: dto.razorpayPaymentId };
  }
}
