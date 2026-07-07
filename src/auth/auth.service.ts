/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisteredUser } from './interfaces/register.interface';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoggedInUser } from './interfaces/login.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private JwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisteredUser> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: registerUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    registerUserDto.password = await this.encryptPassword(
      registerUserDto.password,
    );

    console.log('Registering user:', registerUserDto);
    const user = await this.prisma.user.create({
      data: registerUserDto,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoggedInUser> {
    const user = await this.prisma.user.findFirst({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const hasMatchedPassword = await this.decryptPassword(
      loginUserDto.password,
      user.password,
    );

    if (!hasMatchedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await this.JwtService.signAsync(
      { id: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    return {
      name: user.name,
      email: user.email,
      token: token,
    };
  }

  async encryptPassword(
    password: string,
    saltRounds: number = 10,
  ): Promise<any> {
    return await bcrypt.hash(password, saltRounds);
  }

  async decryptPassword(
    password: string,
    hashedPassword: string,
  ): Promise<any> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
