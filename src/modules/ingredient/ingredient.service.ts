import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PaginationDto, PaginationMetaDto } from './dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class IngredientService {
  private readonly logger = new Logger(IngredientService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    try {
      this.logger.log(`Creating ingredient: ${createIngredientDto.name}`);

      // Check if ingredient name already exists
      const existingIngredient = await this.prisma.ingredients.findFirst({
        where: { name: createIngredientDto.name.trim() },
      });

      if (existingIngredient) {
        throw new ConflictException(
          `Ingredient with name '${createIngredientDto.name}' already exists`,
        );
      }

      const ingredient = await this.prisma.ingredients.create({
        data: {
          name: createIngredientDto.name,
          slug: createIngredientDto.slug,
          categoryId: createIngredientDto.categoryId,
          imageUrl: createIngredientDto.imageUrl ?? '',
        },
      });

      this.logger.log(`Ingredient created successfully: ${ingredient.id}`);
      return ingredient;
    } catch (error) {
      this.logger.error('Failed to create ingredient:', error);
      throw error;
    }
  }

  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    try {
      const skip = (page - 1) * limit;

      this.logger.log(`Fetching ingredients - Page: ${page}, Limit: ${limit}`);

      const [ingredients, totalCount] = await Promise.all([
        this.prisma.ingredients.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.ingredients.count(),
      ]);

      const returnCount = ingredients.length;
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
        `Ingredients fetched successfully - Total: ${totalCount}, Returned: ${returnCount}`,
      );

      return {
        data: ingredients,
        pagination: paginationMeta,
      };
    } catch (error) {
      this.logger.error('Failed to fetch ingredients:', error);
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
      this.logger.log(`Fetching ingredient: ${id}`);

      const ingredient = await this.prisma.ingredients.findUnique({
        where: { id },
      });

      if (!ingredient) {
        throw new NotFoundException(`Ingredient with ID '${id}' not found`);
      }

      this.logger.log(`Ingredient fetched successfully: ${id}`);
      return ingredient;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      this.logger.error('Failed to fetch ingredient:', error);
      throw error;
    }
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    try {
      this.logger.log(`Updating ingredient: ${id}`);

      // Check if ingredient exists
      const existingIngredient = await this.prisma.ingredients.findUnique({
        where: { id },
      });

      if (!existingIngredient) {
        throw new NotFoundException(`Ingredient with ID '${id}' not found`);
      }

      // Check if name is being updated and if it conflicts with existing name
      if (
        updateIngredientDto.name &&
        updateIngredientDto.name !== existingIngredient.name
      ) {
        const nameConflict = await this.prisma.ingredients.findFirst({
          where: { name: updateIngredientDto.name },
        });

        if (nameConflict) {
          throw new ConflictException(
            `Ingredient with name '${updateIngredientDto.name}' already exists`,
          );
        }
      }

      const ingredient = await this.prisma.ingredients.update({
        where: { id },
        data: updateIngredientDto,
      });

      this.logger.log(`Ingredient updated successfully: ${id}`);
      return ingredient;
    } catch (error) {
      this.logger.error('Failed to update ingredient:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Deleting ingredient: ${id}`);

      // Check if ingredient exists
      const existingIngredient = await this.prisma.ingredients.findUnique({
        where: { id },
      });

      if (!existingIngredient) {
        throw new NotFoundException(`Ingredient with ID '${id}' not found`);
      }

      const ingredient = await this.prisma.ingredients.delete({
        where: { id },
      });

      this.logger.log(`Ingredient deleted successfully: ${id}`);
      return ingredient;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      this.logger.error('Failed to delete ingredient:', error);
      throw error;
    }
  }

  findManyById(ids: string[]) {
    return this.prisma.ingredients.findMany({ where: { id: { in: ids } } });
  }
}
