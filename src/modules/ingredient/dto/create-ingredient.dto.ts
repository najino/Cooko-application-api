import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
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
}
