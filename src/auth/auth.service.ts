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

    registerUserDto.password = await this.hashData(registerUserDto.password);

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
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.JwtService.signAsync(
      { id: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    const refreshToken = await this.JwtService.signAsync(
      { id: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async hashData(data: string, saltRounds: number = 10): Promise<any> {
    return await bcrypt.hash(data, saltRounds);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async refreshToken(refreshToken: string): Promise<LoggedInUser> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    let payload: {
      id: number;
      email: string;
      role: string;
    };

    try {
      payload = await this.JwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.JwtService.signAsync(
      { id: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );

    const newRefreshToken = await this.JwtService.signAsync(
      { id: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    await this.updateRefreshToken(user.id, newRefreshToken);

    return {
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
