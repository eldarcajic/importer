import { Injectable } from '@nestjs/common';
import { Board } from './interfaces';

@Injectable()
export class BoardsService {
  getAllBoards() {
    const boards: Board[] = [
      {
        id: '1',
        name: 'Sales Pipeline',
      },
      {
        id: '2',
        name: 'Main Pipeline',
      },
      {
        id: '3',
        name: 'Project Management',
      },
    ];

    return boards;
  }
}
