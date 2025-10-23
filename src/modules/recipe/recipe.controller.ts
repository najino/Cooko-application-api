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
  ApiGetRecipeSuggestions,
} from './swagger/recipe.swagger';
import { GetSuggestionQuery } from './dto/get-suggestion.query';

@ApiRecipeTags()
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  /**
   *  GET /recipes/suggestions?ingredients=ingredientId1,ingredientId2&categories=categoryId1,categoryId2
   * @param query
   */

  @Get('suggestions')
  @ApiGetRecipeSuggestions()
  getRecipeSuggestions(@Query() query: GetSuggestionQuery) {
    return this.recipeService.getRecipeSuggestions(
      query.ingredients,
      query.categories,
    );
  }

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
