import { IsString, IsOptional } from 'class-validator';

export class CreateTodolistDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
