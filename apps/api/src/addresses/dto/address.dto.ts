import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum AddressTypeEnum {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING',
  BOTH = 'BOTH',
}

export class CreateAddressDto {
  @IsEnum(AddressTypeEnum)
  type: AddressTypeEnum;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}
