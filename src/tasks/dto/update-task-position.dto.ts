import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateTaskPositionDto {
  @ApiProperty({
    description: 'ID of the column where the task is located',
    example: 1,
  })
  @IsNumber()
  columnId!: number;
  @ApiProperty({
    description: 'New position of the task within the column',
    example: 2,
  })
  @IsNumber()
  position!: number;
}
