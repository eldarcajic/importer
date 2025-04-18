import { IsString, IsOptional } from 'class-validator';

export class ContactDto {
  @IsString()
  organization_name: string;

  @IsString()
  role: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  [key: `contact_attribute_${string}`]: string;

  @IsString()
  @IsOptional()
  error?: string;
}
