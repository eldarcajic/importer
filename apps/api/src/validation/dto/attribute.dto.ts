import { IsString, IsOptional } from 'class-validator';

export class AttributeDto {
  @IsString()
  identifier: string;

  @IsString()
  title: string;

  @IsString()
  attribute_type: string;

  @IsString()
  @IsOptional()
  error?: string;
}
