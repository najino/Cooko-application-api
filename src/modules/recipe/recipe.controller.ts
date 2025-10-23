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
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PaginationDto } from './dto/pagination.dto';
import {
  ApiRecipeTags,
  ApiCreateRecipe,
  ApiGetRecipes,
  ApiGetRecipe,
  ApiUpdateRecipe,
  ApiDeleteRecipe,
} from './swagger/recipe.swagger';

@ApiRecipeTags()
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateRecipe()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  @Get()
  @ApiGetRecipes()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.recipeService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiGetRecipe()
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateRecipe()
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteRecipe()
  remove(@Param('id') id: string) {
    return this.recipeService.remove(id);
  }
}
