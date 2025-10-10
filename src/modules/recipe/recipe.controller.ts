import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'ایجاد دستور پخت جدید',
    description:
      'یک دستور پخت جدید با عنوان، توضیحات، دستور پخت و مواد اولیه ایجاد می‌کند',
  })
  @ApiResponse({
    status: 201,
    description: 'دستور پخت با موفقیت ایجاد شد',
  })
  @ApiResponse({
    status: 409,
    description: 'دستور پخت با این عنوان قبلاً وجود دارد',
  })
  @ApiResponse({
    status: 404,
    description: 'یکی از دسته‌بندی‌ها یا مواد اولیه یافت نشد',
  })
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'دریافت لیست دستور پخت‌ها',
    description: 'لیست تمام دستور پخت‌ها را با قابلیت صفحه‌بندی برمی‌گرداند',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'شماره صفحه',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'تعداد آیتم در هر صفحه',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'لیست دستور پخت‌ها با موفقیت دریافت شد',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.recipeService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'دریافت دستور پخت با آیدی',
    description: 'جزئیات کامل یک دستور پخت را با آیدی آن برمی‌گرداند',
  })
  @ApiParam({
    name: 'id',
    description: 'آیدی دستور پخت',
    example: '64a1b2c3d4e5f6789012345a',
  })
  @ApiResponse({
    status: 200,
    description: 'دستور پخت با موفقیت دریافت شد',
  })
  @ApiResponse({
    status: 404,
    description: 'دستور پخت یافت نشد',
  })
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'به‌روزرسانی دستور پخت',
    description: 'اطلاعات یک دستور پخت را به‌روزرسانی می‌کند',
  })
  @ApiParam({
    name: 'id',
    description: 'آیدی دستور پخت',
    example: '64a1b2c3d4e5f6789012345a',
  })
  @ApiResponse({
    status: 200,
    description: 'دستور پخت با موفقیت به‌روزرسانی شد',
  })
  @ApiResponse({
    status: 404,
    description: 'دستور پخت یافت نشد',
  })
  @ApiResponse({
    status: 409,
    description: 'دستور پخت با این عنوان قبلاً وجود دارد',
  })
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'حذف دستور پخت',
    description: 'یک دستور پخت را از سیستم حذف می‌کند',
  })
  @ApiParam({
    name: 'id',
    description: 'آیدی دستور پخت',
    example: '64a1b2c3d4e5f6789012345a',
  })
  @ApiResponse({
    status: 204,
    description: 'دستور پخت با موفقیت حذف شد',
  })
  @ApiResponse({
    status: 404,
    description: 'دستور پخت یافت نشد',
  })
  remove(@Param('id') id: string) {
    return this.recipeService.remove(id);
  }
}
