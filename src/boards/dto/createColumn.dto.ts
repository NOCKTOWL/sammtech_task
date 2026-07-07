import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({ example: 'Todo' })
  @IsString()
  @IsNotEmpty()
  title!: string;
}
