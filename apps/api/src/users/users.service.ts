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
        name: 'Anna Cramling',
        email: 'anna.cramling@example.com',
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
      {
        id: '6',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        password: 'password',
        createdAt: new Date('2023-01-07'),
        updatedAt: new Date('2023-01-08'),
        profilePictureUrl: 'https://randomuser.me/api/portraits/med/men/45.jpg',
      },
      {
        id: '7',
        name: 'Sarah Davis',
        email: 'sarah.davis@example.com',
        password: 'password',
        createdAt: new Date('2023-01-09'),
        updatedAt: new Date('2023-01-10'),
        profilePictureUrl:
          'https://randomuser.me/api/portraits/med/women/33.jpg',
      },
      {
        id: '8',
        name: 'David Lee',
        email: 'david.lee@example.com',
        password: 'password',
        createdAt: new Date('2023-01-11'),
        updatedAt: new Date('2023-01-12'),
        profilePictureUrl: 'https://randomuser.me/api/portraits/med/men/55.jpg',
      },
      {
        id: '9',
        name: 'Laura Martinez',
        email: 'laura.martinez@example.com',
        password: 'password',
        createdAt: new Date('2023-01-13'),
        updatedAt: new Date('2023-01-14'),
        profilePictureUrl:
          'https://randomuser.me/api/portraits/med/women/44.jpg',
      },
      {
        id: '10',
        name: 'James Thompson',
        email: 'james.thompson@example.com',
        password: 'password',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-16'),
        profilePictureUrl: 'https://randomuser.me/api/portraits/med/men/65.jpg',
      },
      {
        id: '11',
        name: 'Emily White',
        email: 'emily.white@example.com',
        password: 'password',
        createdAt: new Date('2023-01-17'),
        updatedAt: new Date('2023-01-18'),
        profilePictureUrl:
          'https://randomuser.me/api/portraits/med/women/55.jpg',
      },
      {
        id: '12',
        name: 'Thomas Harris',
        email: 'thomas.harris@example.com',
        password: 'password',
        createdAt: new Date('2023-01-19'),
        updatedAt: new Date('2023-01-20'),
        profilePictureUrl: 'https://randomuser.me/api/portraits/med/men/25.jpg',
      },
      {
        id: '13',
        name: 'Olivia Clark',
        email: 'olivia.clark@example.com',
        password: 'password',
        createdAt: new Date('2023-01-21'),
        updatedAt: new Date('2023-01-22'),
        profilePictureUrl:
          'https://randomuser.me/api/portraits/med/women/66.jpg',
      },
      {
        id: '15',
        name: 'Sophia Adams',
        email: 'sophia.adams@example.com',
        password: 'password',
        createdAt: new Date('2023-01-25'),
        updatedAt: new Date('2023-01-26'),
        profilePictureUrl:
          'https://randomuser.me/api/portraits/med/women/77.jpg',
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
