import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Nabil', description: 'Name of the user' })
  @IsString()
  name!: string;
  @ApiProperty({
    example: 'nabil@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
