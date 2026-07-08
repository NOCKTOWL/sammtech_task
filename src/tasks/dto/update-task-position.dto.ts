import { IsNumber } from 'class-validator';

export class UpdateTaskPositionDto {
  @IsNumber()
  columnId!: number;
  @IsNumber()
  position!: number;
}
