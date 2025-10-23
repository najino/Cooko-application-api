import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId as IsObjectId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    example: ['64a1b2c3d4e5f6789012345c', '64a1b2c3d4e5f6789012345d'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsObjectId({ each: true })
  ingredientIds: string[];

  @ApiPropertyOptional({
    description: 'Recipe image URL (optional)',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;
}
