import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId as IsObjectId,
  IsMongoId,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecipeIngredientType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateRecipeIngredientDto {
  @ApiProperty({
    description: 'Ingredient ID',
    example: '64a1b2c3d4e5f6789012345a',
  })
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  ingredientId: string;

  @ApiProperty({
    description: 'Ingredient type',
    example: 'MAIN',
  })
  @IsEnum(RecipeIngredientType, {
    message: 'Invalid ingredient type, must be MAIN or ADDITIONAL',
  })
  @IsNotEmpty()
  type: RecipeIngredientType;
}

export class CreateRecipeDto {
  @ApiProperty({
    description: 'Recipe title',
    example: 'Ghormeh Sabzi',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Recipe description',
    example: 'A traditional and delicious Persian dish',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Complete cooking instructions',
    example: 'First sauté the meat, then add the vegetables...',
  })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({
    description: 'Meal category IDs',
    example: ['64a1b2c3d4e5f6789012345a', '64a1b2c3d4e5f6789012345b'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsObjectId({ each: true })
  categoryIds: string[];

  @ApiProperty({
    description: 'Required ingredient IDs',
    example: [
      {
        ingredientId: '64a1b2c3d4e5f6789012345a',
        type: RecipeIngredientType.MAIN,
      },
      {
        ingredientId: '64a1b2c3d4e5f6789012345b',
        type: RecipeIngredientType.ADDITIONAL,
      },
    ],
    type: [CreateRecipeIngredientDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredientIds: CreateRecipeIngredientDto[];

  @ApiPropertyOptional({
    description: 'Recipe image URL (optional)',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;
}
