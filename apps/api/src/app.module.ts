import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ValidationModule } from './validation/validation.module';
import { BoardsModule } from './boards/board.module';

@Module({
  imports: [ValidationModule, UsersModule, BoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
