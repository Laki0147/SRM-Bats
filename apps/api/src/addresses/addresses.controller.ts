import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  getAddresses(@Request() req) {
    return this.addressesService.getAddresses(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAddress(@Request() req, @Body() dto: CreateAddressDto) {
    return this.addressesService.createAddress(req.user.id, dto);
  }

  @Put(':id')
  updateAddress(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.updateAddress(req.user.id, id, dto);
  }

  @Delete(':id')
  deleteAddress(@Request() req, @Param('id') id: string) {
    return this.addressesService.deleteAddress(req.user.id, id);
  }

  @Patch(':id/default')
  setDefault(@Request() req, @Param('id') id: string) {
    return this.addressesService.setDefault(req.user.id, id);
  }
}
