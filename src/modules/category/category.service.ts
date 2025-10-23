import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto, PaginationMetaDto } from './dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      this.logger.log(`Creating category: ${createCategoryDto.title}`);

      // Check if slug already exists
      const existingCategory = await this.prisma.mealCategory.findFirst({
        where: { slug: createCategoryDto.slug },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with slug '${createCategoryDto.slug}' already exists`,
        );
      }

      const category = await this.prisma.mealCategory.create({
        data: {
          image: createCategoryDto.image ?? '',
          slug: createCategoryDto.slug,
          title: createCategoryDto.title,
        },
      });

      this.logger.log(`Category created successfully: ${category.id}`);
      return category;
    } catch (error) {
      this.logger.error('Failed to create category:', error);
      throw error;
    }
  }

  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    try {
      const skip = (page - 1) * limit;

      this.logger.log(`Fetching categories - Page: ${page}, Limit: ${limit}`);

      const [categories, totalCount] = await Promise.all([
        this.prisma.mealCategory.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.mealCategory.count(),
      ]);

      const returnCount = categories.length;
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
        `Categories fetched successfully - Total: ${totalCount}, Returned: ${returnCount}`,
      );

      return {
        data: categories,
        pagination: paginationMeta,
      };
    } catch (error) {
      this.logger.error('Failed to fetch categories:', error);
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
      this.logger.log(`Fetching category: ${id}`);

      const category = await this.prisma.mealCategory.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID '${id}' not found`);
      }

      this.logger.log(`Category fetched successfully: ${id}`);
      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      this.logger.error('Failed to fetch category:', error);
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      this.logger.log(`Updating category: ${id}`);

      // Check if category exists
      const existingCategory = await this.prisma.mealCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with ID '${id}' not found`);
      }

      // Check if slug is being updated and if it conflicts with existing slug
      if (
        updateCategoryDto.slug &&
        updateCategoryDto.slug !== existingCategory.slug
      ) {
        const slugConflict = await this.prisma.mealCategory.findUnique({
          where: { slug: updateCategoryDto.slug },
        });

        if (slugConflict) {
          throw new ConflictException(
            `Category with slug '${updateCategoryDto.slug}' already exists`,
          );
        }
      }

      const category = await this.prisma.mealCategory.update({
        where: { id },
        data: updateCategoryDto,
      });

      this.logger.log(`Category updated successfully: ${id}`);
      return category;
    } catch (error) {
      this.logger.error('Failed to update category:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Deleting category: ${id}`);

      // Check if category exists
      const existingCategory = await this.prisma.mealCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with ID '${id}' not found`);
      }

      const category = await this.prisma.mealCategory.delete({
        where: { id },
      });

      this.logger.log(`Category deleted successfully: ${id}`);
      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(error, id);
      }
      this.logger.error('Failed to delete category:', error);
      throw error;
    }
  }

  async getCategoryIngredients(
    categoryId: string,
    { page = 1, limit = 10 }: { page?: number; limit?: number },
  ) {
    try {
      const skip = (page - 1) * limit;

      this.logger.log(
        `Getting category ingredients: ${categoryId} - Page: ${page}, Limit: ${limit}`,
      );

      const [ingredients, totalCount] = await Promise.all([
        this.prisma.ingredients.findMany({
          where: { categoryId },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.ingredients.count({
          where: { categoryId },
        }),
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
        `Category ingredients fetched successfully: ${categoryId} - Total: ${totalCount}, Returned: ${returnCount}`,
      );

      return {
        data: ingredients,
        pagination: paginationMeta,
      };
    } catch (error) {
      this.logger.error('Failed to get category ingredients:', error);
      throw error;
    }
  }

  findManyById(ids: string[]) {
    return this.prisma.mealCategory.findMany({ where: { id: { in: ids } } });
  }
}
