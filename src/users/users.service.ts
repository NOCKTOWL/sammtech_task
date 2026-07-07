import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  // private users: User[] = [];

  getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
