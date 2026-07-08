import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Priority } from 'src/generated/prisma/client';

export class FilterTasksDto {
  @ApiProperty({
    description: 'Title of the task to filter by',
    example: 'Task Title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Priority of the task to filter by',
    example: 'HIGH',
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiProperty({
    description: 'Due date of the task to filter by',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
