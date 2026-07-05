/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users: User[] = [];

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id.toString());
    }

    createUser(createUserDto: CreateUserDto): User {
        const newUser: User = {
            id: (this.users.length + 1).toString(),
            ...createUserDto,
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }
}
