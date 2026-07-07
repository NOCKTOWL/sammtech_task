/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisteredUser } from './interfaces/register.interface';
import { AuthService } from './auth.service';
import { LoggedInUser } from './interfaces/login.interface';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisteredUser> {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoggedInUser> {
    return this.authService.loginUser(loginUserDto);
  }
}
