import { IsString, IsOptional } from 'class-validator';

export class DealDto {
  @IsString()
  address: string;

  @IsString()
  nickname: string;

  @IsString()
  board_name: string;

  @IsString()
  stage_name: string;

  [key: `assignee_${string}`]: string;

  [key: `editor_${string}`]: string;

  [key: `contact_${string}`]: string;

  [key: `deal_attribute_${string}`]: string;

  @IsString()
  @IsOptional()
  error?: string;
}
