import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisteredUser } from './interfaces/register.interface';
import { AuthService } from './auth.service';
import { LoggedInUser } from './interfaces/login.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: RegisterUserDto,
  })
  @Post('/register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisteredUser> {
    return this.authService.registerUser(registerUserDto);
  }

  @ApiOperation({ summary: 'Login a user and return a JWT token' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @Post('/login')
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      ttl: 60000,
      limit: 5,
    },
  })
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoggedInUser> {
    return this.authService.loginUser(loginUserDto);
  }

  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @Post('refresh-token')
  refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<LoggedInUser> {
    return this.authService.refreshToken(refreshToken);
  }
}
