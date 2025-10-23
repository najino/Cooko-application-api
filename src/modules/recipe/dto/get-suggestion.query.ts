import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetSuggestionQuery {
  @ApiProperty({
    description: 'Ingredients',
    example: 'tomato,potato,...',
  })
  @IsString()
  @IsNotEmpty()
  ingredients: string;
}
