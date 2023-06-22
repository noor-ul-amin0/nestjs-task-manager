import { IsDateString, IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  fileAttachments?: string[];

  @IsDateString()
  @IsOptional()
  dueDateTime?: Date;

  @IsBoolean()
  @IsOptional()
  completionStatus?: boolean;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  fileAttachments?: string[];
}
