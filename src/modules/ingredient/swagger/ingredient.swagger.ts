import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiCreateIngredient() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create Ingredient',
      description: 'Create a new ingredient',
    }),
    ApiBody({
      type: 'object',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Tomato',
            description: 'Ingredient name',
          },
          imageUrl: {
            type: 'string',
            example:
              'http://localhost:9000/cooko-uploads/ingredients/uuid-image.jpg',
            description: 'Ingredient image URL',
          },
        },
        required: ['name'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Ingredient created successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Ingredient created successfully',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              name: {
                type: 'string',
                example: 'Tomato',
              },
              imageUrl: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/ingredients/uuid-image.jpg',
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
      description: 'Ingredient with this name already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 409,
          },
          message: {
            type: 'string',
            example: "Ingredient with name 'Tomato' already exists",
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

export function ApiGetIngredients() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get Ingredients',
      description: 'Get all ingredients with pagination',
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
      description: 'Ingredients retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Ingredients retrieved successfully',
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
                name: {
                  type: 'string',
                  example: 'Tomato',
                },
                imageUrl: {
                  type: 'string',
                  example:
                    'http://localhost:9000/cooko-uploads/ingredients/uuid-image.jpg',
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

export function ApiGetIngredient() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get Ingredient',
      description: 'Get a single ingredient by ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Ingredient ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: 200,
      description: 'Ingredient retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Ingredient retrieved successfully',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              name: {
                type: 'string',
                example: 'Tomato',
              },
              imageUrl: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/ingredients/uuid-image.jpg',
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
      description: 'Ingredient not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 404,
          },
          message: {
            type: 'string',
            example: "Ingredient with ID '507f1f77bcf86cd799439011' not found",
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

export function ApiUpdateIngredient() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update Ingredient',
      description: 'Update an ingredient (partial update)',
    }),
    ApiParam({
      name: 'id',
      description: 'Ingredient ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiBody({
      type: 'object',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Fresh Tomato',
            description: 'Ingredient name',
          },
          imageUrl: {
            type: 'string',
            example:
              'http://localhost:9000/cooko-uploads/ingredients/new-uuid-image.jpg',
            description: 'Ingredient image URL',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Ingredient updated successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Ingredient updated successfully',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              name: {
                type: 'string',
                example: 'Fresh Tomato',
              },
              imageUrl: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/ingredients/new-uuid-image.jpg',
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
      description: 'Ingredient not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 404,
          },
          message: {
            type: 'string',
            example: "Ingredient with ID '507f1f77bcf86cd799439011' not found",
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
      description: 'Ingredient with this name already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 409,
          },
          message: {
            type: 'string',
            example: "Ingredient with name 'Fresh Tomato' already exists",
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

export function ApiDeleteIngredient() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete Ingredient',
      description: 'Delete an ingredient by ID',
    }),
    ApiParam({
      name: 'id',
      description: 'Ingredient ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: 200,
      description: 'Ingredient deleted successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Ingredient deleted successfully',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              name: {
                type: 'string',
                example: 'Tomato',
              },
              imageUrl: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/ingredients/uuid-image.jpg',
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
      description: 'Ingredient not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 404,
          },
          message: {
            type: 'string',
            example: "Ingredient with ID '507f1f77bcf86cd799439011' not found",
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

export function ApiIngredientTags() {
  return applyDecorators(ApiTags('Ingredients - Recipe Ingredients'));
}
