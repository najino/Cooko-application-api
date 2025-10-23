import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({
    description: 'Ingredient name',
    example: 'Tomato',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Ingredient image URL',
    example: 'http://localhost:9000/cooko-uploads/ingredients/uuid-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Category ID',
    example: '64a1b2c3d4e5f6789012345a',
  })
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Ingredient slug',
    example: 'tomato',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
