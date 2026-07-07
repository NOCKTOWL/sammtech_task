import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { Priority } from 'src/generated/prisma/client';
import { CreateTaskDto } from './createTask.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  title!: string;
  @IsString()
  description?: string;
  @IsEnum(Priority)
  priority!: Priority;
  @IsDateString()
  dueDate!: Date;
  @IsNumber()
  assignedId!: number;
}
