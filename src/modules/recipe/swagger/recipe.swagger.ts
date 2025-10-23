import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

export const ApiRecipeTags = () => applyDecorators(ApiTags('Recipes'));

export const ApiCreateRecipe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create new recipe',
      description:
        'Creates a new recipe with title, description, instructions and ingredients',
    }),
    ApiBody({
      description: 'New recipe information',
      type: CreateRecipeDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Recipe created successfully',
    }),
    ApiResponse({
      status: 409,
      description: 'Recipe with this title already exists',
    }),
    ApiResponse({
      status: 404,
      description: 'One or more categories or ingredients not found',
    }),
  );

export const ApiGetRecipes = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get recipes list',
      description: 'Returns list of all recipes with pagination support',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of items per page',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Recipes list retrieved successfully',
    }),
  );

export const ApiGetRecipe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get recipe by ID',
      description: 'Returns complete details of a recipe by its ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Recipe ID',
      example: '64a1b2c3d4e5f6789012345a',
    }),
    ApiResponse({
      status: 200,
      description: 'Recipe retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Recipe not found',
    }),
  );

export const ApiUpdateRecipe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update recipe',
      description: 'Updates recipe information',
    }),
    ApiParam({
      name: 'id',
      description: 'Recipe ID',
      example: '64a1b2c3d4e5f6789012345a',
    }),
    ApiBody({
      description: 'Updated recipe information',
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Recipe title',
            example: 'Ghormeh Sabzi',
          },
          description: {
            type: 'string',
            description: 'Recipe description',
            example: 'A traditional and delicious Persian dish',
          },
          instructions: {
            type: 'string',
            description: 'Complete cooking instructions',
            example: 'First sauté the meat, then add the vegetables...',
          },
          categoryIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'Meal category IDs',
            example: ['64a1b2c3d4e5f6789012345a', '64a1b2c3d4e5f6789012345b'],
          },
          ingredientIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'Required ingredient IDs',
            example: ['64a1b2c3d4e5f6789012345c', '64a1b2c3d4e5f6789012345d'],
          },
          image: {
            type: 'string',
            description: 'Recipe image URL (optional)',
            example: 'https://example.com/image.jpg',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Recipe updated successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Recipe not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Recipe with this title already exists',
    }),
  );

export const ApiDeleteRecipe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete recipe',
      description: 'Deletes a recipe from the system',
    }),
    ApiParam({
      name: 'id',
      description: 'Recipe ID',
      example: '64a1b2c3d4e5f6789012345a',
    }),
    ApiResponse({
      status: 204,
      description: 'Recipe deleted successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Recipe not found',
    }),
  );

export const ApiGetRecipeSuggestions = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get recipe suggestions based on main ingredients',
      description:
        'Returns recipes that match the provided main ingredients, sorted by match count',
    }),
    ApiQuery({
      name: 'ingredients',
      required: true,
      description: 'Comma-separated list of ingredient IDs',
      example: '64a1b2c3d4e5f6789012345a,64a1b2c3d4e5f6789012345b',
    }),
    ApiResponse({
      status: 200,
      description: 'Recipe suggestions retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Recipe ID',
              example: '64a1b2c3d4e5f6789012345a',
            },
            title: {
              type: 'string',
              description: 'Recipe title',
              example: 'Ghormeh Sabzi',
            },
            description: {
              type: 'string',
              description: 'Recipe description',
              example: 'A traditional Persian dish',
            },
            instructions: {
              type: 'string',
              description: 'Cooking instructions',
              example: 'First sauté the meat...',
            },
            image: {
              type: 'string',
              description: 'Recipe image URL',
              example: 'https://example.com/image.jpg',
            },
            matchCount: {
              type: 'number',
              description: 'Number of matching main ingredients',
              example: 3,
            },
            mainIngredientsData: {
              type: 'array',
              description: 'Main ingredients data',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  imageUrl: { type: 'string' },
                },
              },
            },
            categoriesData: {
              type: 'array',
              description: 'Recipe categories data',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  title: { type: 'string' },
                  slug: { type: 'string' },
                  image: { type: 'string' },
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'No ingredients provided',
    }),
  );
