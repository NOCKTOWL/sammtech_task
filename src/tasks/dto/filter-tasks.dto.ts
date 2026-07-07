import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Priority } from 'src/generated/prisma/client';

export class FilterTasksDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
