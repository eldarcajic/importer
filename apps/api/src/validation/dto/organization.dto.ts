import { IsString, IsOptional } from 'class-validator';

export class OrganizationDto {
  @IsString()
  name: string;

  [key: `organization_attribute_${string}`]: string;

  @IsString()
  @IsOptional()
  error?: string;
}
