import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private get keyId(): string {
    return process.env.RAZORPAY_KEY_ID || '';
  }

  private get keySecret(): string {
    return process.env.RAZORPAY_KEY_SECRET || '';
  }

  /**
   * Create a Razorpay order via REST API (no SDK dependency)
   */
  async createRazorpayOrder(amount: number, currency = 'INR', receipt?: string) {
    if (!this.keyId || !this.keySecret) {
      throw new InternalServerErrorException('Razorpay credentials not configured');
    }

    // amount is in rupees; Razorpay requires paise (minimum 100 paise = ₹1)
    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 100) {
      // client-side validation error → 400, not 500
      throw new BadRequestException('Minimum order amount is ₹1 (100 paise)');
    }

    const body = JSON.stringify({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    const credentials = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body,
    });

    if (!response.ok) {
      const err = (await response.json()) as { error?: { description?: string } };
      const description = err.error?.description || 'Razorpay order creation failed';
      // Razorpay rejected our key/secret → surface as an auth failure
      if (response.status === 401) {
        throw new UnauthorizedException(`Razorpay authentication failed: ${description}`);
      }
      throw new InternalServerErrorException(description);
    }

    return response.json();
  }

  /**
   * Verify Razorpay payment signature
   */
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const hmac = crypto.createHmac('sha256', this.keySecret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const expectedSignature = hmac.digest('hex');
    return expectedSignature === razorpaySignature;
  }
}
