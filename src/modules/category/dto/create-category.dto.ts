import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category title',
    example: 'Italian Cuisine',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Category slug (unique identifier)',
    example: 'italian-cuisine',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Category image URL',
    example: 'http://localhost:9000/cooko-uploads/categories/uuid-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
