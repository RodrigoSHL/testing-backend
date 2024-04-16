import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  createdAt: Date;
}
