import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PaginationDto, PaginationMetaDto } from './dto/pagination.dto';
import { Prisma, Recipe } from '@prisma/client';
import { CategoryService } from '../category/category.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { ObjectId, EJSON } from 'bson';

@Injectable()
export class RecipeService {
  private readonly logger = new Logger(RecipeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly categroyService: CategoryService,
    private readonly ingredientService: IngredientService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto) {
    try {
      this.logger.log(`Creating recipe: ${createRecipeDto.title}`);

      // Check if recipe title already exists
      const existingRecipe = await this.prisma.recipe.findFirst({
        where: { title: createRecipeDto.title.trim() },
      });

      if (existingRecipe) {
        throw new ConflictException(
          `Recipe with title '${createRecipeDto.title}' already exists`,
        );
      }

      // Validate categories exist
      const categories = await this.categroyService.findManyById(
        createRecipeDto.categoryIds,
      );

      if (categories.length !== createRecipeDto.categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }

      // Validate ingredients exist
      const ingredients = await this.ingredientService.findManyById(
        createRecipeDto.ingredientIds.map(
          (ingredient) => ingredient.ingredientId,
        ),
      );

      if (ingredients.length !== createRecipeDto.ingredientIds.length) {
        throw new NotFoundException('One or more ingredients not found');
      }

      // Create recipe with relations
      const recipe = await this.prisma.recipe.create({
        data: {
          title: createRecipeDto.title,
          description: createRecipeDto.description || '',
          instructions: createRecipeDto.instructions,
          image: createRecipeDto.image || '',
          categoryIds: createRecipeDto.categoryIds,
          ingredients: {
            create: createRecipeDto.ingredientIds.map((ingredient) => ({
              ingredientId: ingredient.ingredientId,
              type: ingredient.type,
            })),
          },
          categories: {
            create: categories.map((category) => ({
              categoryId: category.id,
            })),
          },
        },
      });

      this.logger.log(`Recipe created successfully: ${recipe.id}`);
      return recipe;
    } catch (error) {
      this.logger.error('Failed to create recipe:', error);
      throw error;
    }
  }

  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    try {
      const skip = (page - 1) * limit;

      this.logger.log(`Fetching recipes - Page: ${page}, Limit: ${limit}`);

      const [recipes, totalCount] = await Promise.all([
        this.prisma.recipe.findMany({
          skip,
          take: +limit,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        this.prisma.recipe.count(),
      ]);

      const returnCount = recipes.length;
      const hasPrevPage = page > 1;
      const hasNextPage = skip + limit < totalCount;

      const paginationMeta: PaginationMetaDto = {
        totalCount,
        returnCount,
        page,
        limit,
        hasPrevPage,
        hasNextPage,
      };

      this.logger.log(
        `Recipes fetched successfully - Total: ${totalCount}, Returned: ${returnCount}`,
      );

      return {
        data: recipes,
        pagination: paginationMeta,
      };
    } catch (error) {
      this.logger.error('Failed to fetch recipes:', error);
      throw error;
    }
  }

  private handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError,
    value?: string,
  ) {
    if (error.code === 'P2023') {
      throw new NotFoundException(`Item with ID '${value}' not found`);
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Fetching recipe: ${id}`);

      const recipe = await this.prisma.recipe.findUnique({
        where: { id },
        include: {
          categories: true,
          ingredients: true,
        },
      });

      if (!recipe) {
        throw new NotFoundException(`Recipe with ID '${id}' not found`);
      }

      this.logger.log(`Recipe fetched successfully: ${id}`);
      return recipe;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      this.logger.error('Failed to fetch recipe:', error);
      throw error;
    }
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    try {
      this.logger.log(`Updating recipe: ${id}`);

      // Check if recipe exists
      const existingRecipe = await this.prisma.recipe.findUnique({
        where: { id },
      });

      if (!existingRecipe) {
        throw new NotFoundException(`Recipe with ID '${id}' not found`);
      }

      // Check if title is being updated and if it conflicts with existing title
      if (
        updateRecipeDto.title &&
        updateRecipeDto.title !== existingRecipe.title
      ) {
        const titleConflict = await this.prisma.recipe.findFirst({
          where: { title: updateRecipeDto.title },
        });

        if (titleConflict) {
          throw new ConflictException(
            `Recipe with title '${updateRecipeDto.title}' already exists`,
          );
        }
      }

      // Validate categories if provided
      if (updateRecipeDto.categoryIds) {
        const categories = await this.prisma.mealCategory.findMany({
          where: { id: { in: updateRecipeDto.categoryIds } },
        });

        if (categories.length !== updateRecipeDto.categoryIds.length) {
          throw new NotFoundException('One or more categories not found');
        }
      }

      // Validate ingredients if provided
      if (updateRecipeDto.ingredientIds) {
        const ingredients = await this.prisma.ingredients.findMany({
          where: {
            id: {
              in: updateRecipeDto.ingredientIds.map(
                (ingredient) => ingredient.ingredientId,
              ),
            },
          },
        });

        if (ingredients.length !== updateRecipeDto.ingredientIds.length) {
          throw new NotFoundException('One or more ingredients not found');
        }
      }

      // Prepare update data
      const updateData: any = {
        title: updateRecipeDto.title,
        description: updateRecipeDto.description,
        instructions: updateRecipeDto.instructions,
        image: updateRecipeDto.image,
      };

      // Handle categoryIds update
      if (updateRecipeDto.categoryIds) {
        updateData.categoryIds = updateRecipeDto.categoryIds;
        updateData.categories = {
          deleteMany: {},
          create: updateRecipeDto.categoryIds.map((categoryId) => ({
            categoryId,
          })),
        };
      }

      // Handle ingredientIds update
      if (updateRecipeDto.ingredientIds) {
        updateData.ingredients = {
          deleteMany: {},
          create: updateRecipeDto.ingredientIds.map((ingredientId) => ({
            ingredientId,
          })),
        };
      }

      const recipe = await this.prisma.recipe.update({
        where: { id },
        data: updateData,
      });

      this.logger.log(`Recipe updated successfully: ${id}`);
      return recipe;
    } catch (error) {
      this.logger.error('Failed to update recipe:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Deleting recipe: ${id}`);

      // Check if recipe exists
      const existingRecipe = await this.prisma.recipe.findUnique({
        where: { id },
      });

      if (!existingRecipe) {
        throw new NotFoundException(`Recipe with ID '${id}' not found`);
      }

      const recipe = await this.prisma.recipe.delete({
        where: { id },
      });

      this.logger.log(`Recipe deleted successfully: ${id}`);
      return recipe;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      this.logger.error('Failed to delete recipe:', error);
      throw error;
    }
  }

  async getRecipeSuggestions(ingredients: string) {
    try {
      const splitIngredients = ingredients
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
        .map((id) => id);

      if (splitIngredients.length === 0) {
        throw new BadRequestException('No ingredients provided!');
      }

      this.logger.log(
        `Getting recipe suggestions for ingredients: ${splitIngredients.join(', ')}`,
      );

      // Use raw MongoDB aggregation to replicate the exact behavior of your query
      const recipes = await this.prisma.recipe.aggregateRaw({
        pipeline: [
          {
            $lookup: {
              from: 'recipe_ingredients',
              localField: '_id',
              foreignField: 'recipeId',
              as: 'recipeIngredients',
            },
          },
          {
            $addFields: {
              mainIngredients: {
                $filter: {
                  input: '$recipeIngredients',
                  as: 'ri',
                  cond: { $eq: ['$$ri.type', 'MAIN'] },
                },
              },
            },
          },
          {
            $addFields: {
              mainIngredientsIds: {
                $map: {
                  input: '$mainIngredients',
                  as: 'mi',
                  in: '$$mi.ingredientId',
                },
              },
            },
          },
          {
            $addFields: {
              matchCount: {
                $size: {
                  $setIntersection: [
                    '$mainIngredientsIds',
                    splitIngredients.map((id) => ({ $oid: id })),
                  ],
                },
              },
            },
          },
          {
            $match: { matchCount: { $gt: 0 } },
          },
          {
            $sort: { matchCount: -1 },
          },
          {
            $lookup: {
              from: 'ingredients',
              localField: 'mainIngredientsIds',
              foreignField: '_id',
              as: 'mainIngredientsData',
            },
          },
          {
            $lookup: {
              from: 'meal_categories',
              localField: 'categoryIds',
              foreignField: '_id',
              as: 'categoriesData',
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              image: 1,
              ingredients: 1,
              categories: 1,
              matchCount: 1,
              mainIngredientsData: 1,
              categoriesData: 1,
            },
          },
        ],
      });

      return EJSON.deserialize(recipes);
    } catch (error) {
      this.logger.error('Failed to get recipe suggestions:', error);
      throw error;
    }
  }
}
