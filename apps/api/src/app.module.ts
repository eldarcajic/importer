import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [LinksModule, ValidationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
