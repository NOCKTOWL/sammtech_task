import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority } from 'src/generated/prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'New Task Title',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Description of the task',
    example: 'Task description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Priority of the task',
    example: 'HIGH',
  })
  @IsEnum(Priority)
  priority!: Priority;

  @ApiProperty({
    description: 'Due date of the task',
    example: '2023-12-31',
  })
  @IsDateString()
  dueDate!: Date;

  @ApiProperty({
    description: 'ID of the user to whom the task is assigned',
    example: 1,
  })
  @IsNumber()
  assignedId!: number;
}
