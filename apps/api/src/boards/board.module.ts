import { Module } from '@nestjs/common';
import { BoardsService } from './board.service';
import { BoardsController } from './board.controller';

@Module({
  providers: [BoardsService],
  controllers: [BoardsController],
  exports: [BoardsService],
})
export class BoardsModule {}
