import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttributeDto } from './attribute.dto';
import { ContactDto } from './contact.dto';
import { DealDto } from './deal.dto';
import { OrganizationDto } from './organization.dto';
import { StageDto } from './stage.dto';

export class TableDataDto<T> {
  @IsString()
  tableName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  data: T[];
}

export class JsonDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type((opts) => {
    const tableName = (opts?.object as any)?.tableName;
    switch (tableName) {
      case 'Attribute':
        return AttributeDto;
      case 'Contact':
        return ContactDto;
      case 'Deal':
        return DealDto;
      case 'Organization':
        return OrganizationDto;
      case 'Stage':
        return StageDto;
      default:
        return Object;
    }
  })
  tables: TableDataDto<
    AttributeDto | ContactDto | DealDto | OrganizationDto | StageDto
  >[];
}
