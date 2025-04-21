import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { BoardsService } from './board.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  getAllBoards() {
    try {
      const boards = this.boardsService.getAllBoards();
      return boards;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Getting boards failed: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
