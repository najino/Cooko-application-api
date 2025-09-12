import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiCreateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create Category',
      description: 'Create a new meal category',
    }),
    ApiBody({
      type: 'object',
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'Italian Cuisine',
            description: 'Category title',
          },
          slug: {
            type: 'string',
            example: 'italian-cuisine',
            description: 'Category slug (unique identifier)',
          },
          image: {
            type: 'string',
            example:
              'http://localhost:9000/cooko-uploads/categories/uuid-image.jpg',
            description: 'Category image URL',
          },
        },
        required: ['title', 'slug'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Category created successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Category created successfully',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              title: {
                type: 'string',
                example: 'Italian Cuisine',
              },
              slug: {
                type: 'string',
                example: 'italian-cuisine',
              },
              image: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/categories/uuid-image.jpg',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Category with this slug already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 409,
          },
          message: {
            type: 'string',
            example: "Category with slug 'italian-cuisine' already exists",
          },
          error: {
            type: 'string',
            example: 'Conflict',
          },
        },
      },
    }),
  );
}

export function ApiGetCategories() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get Categories',
      description: 'Get all categories with pagination',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: 'number',
      example: 1,
      description: 'Page number (starts from 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'number',
      example: 10,
      description: 'Number of items per page',
    }),
    ApiResponse({
      status: 200,
      description: 'Categories retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Categories retrieved successfully',
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439011',
                },
                title: {
                  type: 'string',
                  example: 'Italian Cuisine',
                },
                slug: {
                  type: 'string',
                  example: 'italian-cuisine',
                },
                image: {
                  type: 'string',
                  example:
                    'http://localhost:9000/cooko-uploads/categories/uuid-image.jpg',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-01T00:00:00.000Z',
                },
              },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              totalCount: {
                type: 'number',
                example: 50,
              },
              returnCount: {
                type: 'number',
                example: 10,
              },
              page: {
                type: 'number',
                example: 1,
              },
              limit: {
                type: 'number',
                example: 10,
              },
              hasPrevPage: {
                type: 'boolean',
                example: false,
              },
              hasNextPage: {
                type: 'boolean',
                example: true,
              },
            },
          },
        },
      },
    }),
  );
}

export function ApiGetCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get Category',
      description: 'Get a single category by ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Category ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: 200,
      description: 'Category retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Category retrieved successfully',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              title: {
                type: 'string',
                example: 'Italian Cuisine',
              },
              slug: {
                type: 'string',
                example: 'italian-cuisine',
              },
              image: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/categories/uuid-image.jpg',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 404,
          },
          message: {
            type: 'string',
            example: "Category with ID '507f1f77bcf86cd799439011' not found",
          },
          error: {
            type: 'string',
            example: 'Not Found',
          },
        },
      },
    }),
  );
}

export function ApiUpdateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update Category',
      description: 'Update a category (partial update)',
    }),
    ApiParam({
      name: 'id',
      description: 'Category ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiBody({
      type: 'object',
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'Updated Italian Cuisine',
            description: 'Category title',
          },
          slug: {
            type: 'string',
            example: 'updated-italian-cuisine',
            description: 'Category slug (unique identifier)',
          },
          image: {
            type: 'string',
            example:
              'http://localhost:9000/cooko-uploads/categories/new-uuid-image.jpg',
            description: 'Category image URL',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Category updated successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Category updated successfully',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              title: {
                type: 'string',
                example: 'Updated Italian Cuisine',
              },
              slug: {
                type: 'string',
                example: 'updated-italian-cuisine',
              },
              image: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/categories/new-uuid-image.jpg',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T12:00:00.000Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 404,
          },
          message: {
            type: 'string',
            example: "Category with ID '507f1f77bcf86cd799439011' not found",
          },
          error: {
            type: 'string',
            example: 'Not Found',
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Category with this slug already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 409,
          },
          message: {
            type: 'string',
            example:
              "Category with slug 'updated-italian-cuisine' already exists",
          },
          error: {
            type: 'string',
            example: 'Conflict',
          },
        },
      },
    }),
  );
}

export function ApiDeleteCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete Category',
      description: 'Delete a category by ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Category ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: 200,
      description: 'Category deleted successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Category deleted successfully',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              title: {
                type: 'string',
                example: 'Italian Cuisine',
              },
              slug: {
                type: 'string',
                example: 'italian-cuisine',
              },
              image: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/categories/uuid-image.jpg',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 404,
          },
          message: {
            type: 'string',
            example: "Category with ID '507f1f77bcf86cd799439011' not found",
          },
          error: {
            type: 'string',
            example: 'Not Found',
          },
        },
      },
    }),
  );
}

export function ApiCategoryTags() {
  return applyDecorators(ApiTags('Categories - Meal Categories'));
}
