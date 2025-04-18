import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationService } from './validation.service';
import { JsonDataDto } from './dto/json-data.dto';

@Controller('validate')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post()
  validateData(@Body() jsonData: JsonDataDto) {
    try {
      const validatedData = this.validationService.validateJsonData(jsonData);
      return validatedData;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Validation failed: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
