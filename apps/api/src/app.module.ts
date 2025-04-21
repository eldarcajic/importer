import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ValidationModule } from './validation/validation.module';
import { ValidationService } from './validation/validation.service';

@Module({
  imports: [LinksModule, ValidationModule],
  controllers: [AppController],
  providers: [AppService, ValidationService],
})
export class AppModule {}
