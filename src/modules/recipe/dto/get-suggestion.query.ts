import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GetSuggestionQuery {
  @ApiProperty({
    description: 'Ingredients',
    example: '1234567890,1234567891',
  })
  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @ApiProperty({
    description: 'Categories',
    example: '1234567890,1234567891',
  })
  @IsArray()
  @IsNotEmpty()
  categories: string;
}
