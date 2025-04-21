import { Injectable } from '@nestjs/common';
import { User } from './interfaces';

@Injectable()
export class UsersService {
  getAllUsers() {
    const users: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        profilePictureUrl: 'https://randomuser.me/api/portraits/med/men/75.jpg',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password',
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-04'),
        profilePictureUrl:
          'https://randomuser.me/api/portraits/med/women/2.jpg',
      },
      {
        id: '3',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: 'password',
        createdAt: new Date('2023-01-05'),
        updatedAt: new Date('2023-01-06'),
        profilePictureUrl:
          'https://randomuser.me/api/portraits/med/women/12.jpg',
      },
      {
        id: '4',
        name: 'Emma Carter',
        email: 'emma.carter@example.com',
        password: 'password',
        createdAt: new Date('2023-01-05'),
        updatedAt: new Date('2023-01-06'),
        profilePictureUrl:
          'https://randomuser.me/api/portraits/med/women/22.jpg',
      },
      {
        id: '5',
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        password: 'password',
        createdAt: new Date('2023-01-05'),
        updatedAt: new Date('2023-01-06'),
        profilePictureUrl: 'https://randomuser.me/api/portraits/med/men/32.jpg',
      },
    ];

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
    }));
  }
}
