import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { ValidationController } from './validation.controller';
import { UsersService } from 'src/users/users.service';
import { BoardsService } from 'src/boards/board.service';
import { UsersModule } from 'src/users/users.module';
import { BoardsModule } from 'src/boards/board.module';

@Module({
  imports: [UsersModule, BoardsModule],
  providers: [ValidationService],
  controllers: [ValidationController],
})
export class ValidationModule {}
