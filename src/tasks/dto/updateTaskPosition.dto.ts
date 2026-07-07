import { IsNumber } from 'class-validator';

export class UpdateTaskPositionDto {
  @IsNumber()
  position!: number;
}
