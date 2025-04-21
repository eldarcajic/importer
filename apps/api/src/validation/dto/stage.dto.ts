import { IsString, IsOptional } from 'class-validator';

export class StageDto {
  @IsString()
  board_name: string;

  @IsString()
  name: string;

  @IsString()
  order_index: string;

  @IsString()
  @IsOptional()
  error?: string;
}
