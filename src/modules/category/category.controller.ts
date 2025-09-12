import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from './dto/pagination.dto';
import {
  ApiCategoryTags,
  ApiCreateCategory,
  ApiGetCategories,
  ApiGetCategory,
  ApiUpdateCategory,
  ApiDeleteCategory,
} from './swagger/category.swagger';

@ApiCategoryTags()
@Controller('categories')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreateCategory()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      this.logger.log(`Create category request: ${createCategoryDto.title}`);

      const category = await this.categoryService.create(createCategoryDto);

      return {
        success: true,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      this.logger.error('Failed to create category:', error);
      throw error;
    }
  }

  @ApiGetCategories()
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      this.logger.log(
        `Get categories request - Page: ${paginationDto.page}, Limit: ${paginationDto.limit}`,
      );

      const result = await this.categoryService.findAll({
        page: paginationDto.page && +paginationDto.page,
        limit: paginationDto.limit && +paginationDto.limit,
      });

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      this.logger.error('Failed to get categories:', error);
      throw error;
    }
  }

  @ApiGetCategory()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Get category request: ${id}`);

      const category = await this.categoryService.findOne(id);

      return {
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      this.logger.error('Failed to get category:', error);
      throw error;
    }
  }

  @ApiUpdateCategory()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      this.logger.log(`Update category request: ${id}`);

      const category = await this.categoryService.update(id, updateCategoryDto);

      return {
        success: true,
        message: 'Category updated successfully',
        data: category,
      };
    } catch (error) {
      this.logger.error('Failed to update category:', error);
      throw error;
    }
  }

  @ApiDeleteCategory()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Delete category request: ${id}`);

      const category = await this.categoryService.remove(id);

      return {
        success: true,
        message: 'Category deleted successfully',
        data: category,
      };
    } catch (error) {
      this.logger.error('Failed to delete category:', error);
      throw error;
    }
  }
}
