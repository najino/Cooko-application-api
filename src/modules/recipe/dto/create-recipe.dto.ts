import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsObjectId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({
    description: 'عنوان دستور پخت',
    example: 'قورمه سبزی',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'توضیحات دستور پخت',
    example: 'یک غذای سنتی و خوشمزه ایرانی',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'دستور پخت کامل',
    example: 'ابتدا گوشت را تفت دهید، سپس سبزیجات را اضافه کنید...',
  })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({
    description: 'آیدی دسته‌بندی‌های غذا',
    example: ['64a1b2c3d4e5f6789012345a', '64a1b2c3d4e5f6789012345b'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsObjectId({ each: true })
  categoryIds: string[];

  @ApiProperty({
    description: 'آیدی مواد اولیه مورد نیاز',
    example: ['64a1b2c3d4e5f6789012345c', '64a1b2c3d4e5f6789012345d'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsObjectId({ each: true })
  ingredientIds: string[];

  @ApiPropertyOptional({
    description: 'آدرس تصویر غذا (اختیاری)',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;
}

