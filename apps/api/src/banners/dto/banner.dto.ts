import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @MinLength(1)
  heading: string;

  @IsOptional()
  @IsString()
  subtext?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
