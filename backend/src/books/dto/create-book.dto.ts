import { IsString, IsInt, IsOptional, Min, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  isbn: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsInt()
  authorId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[];

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

