import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiUploadFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload File',
      description: 'Upload image file to MinIO storage',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Image file (JPEG or PNG)',
          },
        },
        required: ['file'],
      },
    }),
    ApiQuery({
      name: 'type',
      required: false,
      enum: ['category'],
      example: 'category',
    }),
    ApiResponse({
      status: 201,
      description: 'File uploaded successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'File uploaded successfully',
          },
          data: {
            type: 'object',
            properties: {
              originalName: {
                type: 'string',
                example: 'image.jpg',
              },
              fileName: {
                type: 'string',
                example: 'uuid-filename.jpg',
              },
              size: {
                type: 'number',
                example: 1024000,
              },
              mimetype: {
                type: 'string',
                example: 'image/jpeg',
              },
              publicUrl: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/categories/uuid-filename.jpg',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request error',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'No file provided',
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
        },
      },
    }),
    ApiResponse({
      status: 422,
      description: 'File type not allowed',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 422,
          },
          message: {
            type: 'string',
            example: 'File type not allowed',
          },
          error: {
            type: 'string',
            example: 'Unprocessable Entity',
          },
        },
      },
    }),
  );
}

export function ApiDeleteFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete File',
      description: 'Delete file from MinIO storage',
    }),
    ApiParam({
      name: 'objectName',
      description: 'File name in storage',
      example: 'categories/uuid-filename.jpg',
    }),
    ApiResponse({
      status: 200,
      description: 'File deleted successfully',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'File deleted successfully',
          },
          data: {
            type: 'object',
            properties: {
              objectName: {
                type: 'string',
                example: 'categories/uuid-filename.jpg',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'خطا در حذف فایل',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Failed to delete file: File not found',
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
        },
      },
    }),
  );
}

export function ApiGetPublicUrl() {
  return applyDecorators(
    ApiOperation({
      summary: 'دریافت لینک عمومی فایل',
      description: 'دریافت لینک عمومی فایل از استوریج MinIO',
    }),
    ApiParam({
      name: 'objectName',
      description: 'نام فایل در استوریج',
      example: 'categories/uuid-filename.jpg',
    }),
    ApiResponse({
      status: 200,
      description: 'لینک عمومی با موفقیت تولید شد',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Public URL generated successfully',
          },
          data: {
            type: 'object',
            properties: {
              objectName: {
                type: 'string',
                example: 'categories/uuid-filename.jpg',
              },
              publicUrl: {
                type: 'string',
                example:
                  'http://localhost:9000/cooko-uploads/categories/uuid-filename.jpg',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'خطا در تولید لینک عمومی',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Failed to generate public URL: File not found',
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
        },
      },
    }),
  );
}

export function ApiUploaderTags() {
  return applyDecorators(ApiTags('آپلودر - File Uploader'));
}
