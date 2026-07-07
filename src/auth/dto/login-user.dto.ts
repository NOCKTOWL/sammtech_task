import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({
    example: 'nabil@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
