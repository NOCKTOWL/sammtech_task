import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { Priority } from 'src/generated/prisma/client';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ description: 'Title of the task', example: 'New Task Title' })
  @IsString()
  title!: string;
  @ApiProperty({
    description: 'Description of the task',
    example: 'Task description',
  })
  @IsString()
  description?: string;
  @ApiProperty({ description: 'Priority of the task', example: 'HIGH' })
  @IsEnum(Priority)
  priority!: Priority;
  @ApiProperty({ description: 'Due date of the task', example: '2023-12-31' })
  @IsDateString()
  dueDate!: Date;
  @ApiProperty({
    description: 'ID of the user assigned to the task',
    example: 1,
  })
  @IsNumber()
  assignedId!: number;
}
