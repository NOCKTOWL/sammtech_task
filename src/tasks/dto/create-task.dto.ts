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
  @IsString()
  @IsNotEmpty()
  title!: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsEnum(Priority)
  priority!: Priority;
  @IsDateString()
  dueDate!: Date;
  @IsNumber()
  assignedId!: number;
  // @IsNumber()
  // @IsOptional()
  // position?: number | null;
}
