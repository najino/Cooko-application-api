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
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PaginationDto } from './dto/pagination.dto';
import {
  ApiIngredientTags,
  ApiCreateIngredient,
  ApiGetIngredients,
  ApiGetIngredient,
  ApiUpdateIngredient,
  ApiDeleteIngredient,
} from './swagger/ingredient.swagger';

@ApiIngredientTags()
@Controller('ingredients')
export class IngredientController {
  private readonly logger = new Logger(IngredientController.name);

  constructor(private readonly ingredientService: IngredientService) {}

  @ApiCreateIngredient()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    try {
      this.logger.log(`Create ingredient request: ${createIngredientDto.name}`);

      const ingredient =
        await this.ingredientService.create(createIngredientDto);

      return {
        success: true,
        message: 'Ingredient created successfully',
        data: ingredient,
      };
    } catch (error) {
      this.logger.error('Failed to create ingredient:', error);
      throw error;
    }
  }

  @ApiGetIngredients()
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      this.logger.log(
        `Get ingredients request - Page: ${paginationDto.page}, Limit: ${paginationDto.limit}`,
      );

      const result = await this.ingredientService.findAll({
        page: paginationDto.page && +paginationDto.page,
        limit: paginationDto.limit && +paginationDto.limit,
      });

      return {
        success: true,
        message: 'Ingredients retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      this.logger.error('Failed to get ingredients:', error);
      throw error;
    }
  }

  @ApiGetIngredient()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Get ingredient request: ${id}`);

      const ingredient = await this.ingredientService.findOne(id);

      return {
        success: true,
        message: 'Ingredient retrieved successfully',
        data: ingredient,
      };
    } catch (error) {
      this.logger.error('Failed to get ingredient:', error);
      throw error;
    }
  }

  @ApiUpdateIngredient()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    try {
      this.logger.log(`Update ingredient request: ${id}`);

      const ingredient = await this.ingredientService.update(
        id,
        updateIngredientDto,
      );

      return {
        success: true,
        message: 'Ingredient updated successfully',
        data: ingredient,
      };
    } catch (error) {
      this.logger.error('Failed to update ingredient:', error);
      throw error;
    }
  }

  @ApiDeleteIngredient()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Delete ingredient request: ${id}`);

      const ingredient = await this.ingredientService.remove(id);

      return {
        success: true,
        message: 'Ingredient deleted successfully',
        data: ingredient,
      };
    } catch (error) {
      this.logger.error('Failed to delete ingredient:', error);
      throw error;
    }
  }
}
