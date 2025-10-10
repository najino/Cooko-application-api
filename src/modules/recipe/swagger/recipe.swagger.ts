import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';

export const ApiRecipeTags = () => applyDecorators(ApiTags('Recipes'));

export const ApiCreateRecipe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'ایجاد دستور پخت جدید',
      description:
        'یک دستور پخت جدید با عنوان، توضیحات، دستور پخت و مواد اولیه ایجاد می‌کند',
    }),
    ApiBody({
      description: 'اطلاعات دستور پخت جدید',
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'عنوان دستور پخت',
            example: 'قورمه سبزی',
          },
          description: {
            type: 'string',
            description: 'توضیحات دستور پخت',
            example: 'یک غذای سنتی و خوشمزه ایرانی',
          },
          instructions: {
            type: 'string',
            description: 'دستور پخت کامل',
            example: 'ابتدا گوشت را تفت دهید، سپس سبزیجات را اضافه کنید...',
          },
          categoryIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'آیدی دسته‌بندی‌های غذا',
            example: ['64a1b2c3d4e5f6789012345a', '64a1b2c3d4e5f6789012345b'],
          },
          ingredientIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'آیدی مواد اولیه مورد نیاز',
            example: ['64a1b2c3d4e5f6789012345c', '64a1b2c3d4e5f6789012345d'],
          },
          image: {
            type: 'string',
            description: 'آدرس تصویر غذا (اختیاری)',
            example: 'https://example.com/image.jpg',
          },
        },
        required: ['title', 'instructions', 'categoryIds', 'ingredientIds'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'دستور پخت با موفقیت ایجاد شد',
    }),
    ApiResponse({
      status: 409,
      description: 'دستور پخت با این عنوان قبلاً وجود دارد',
    }),
    ApiResponse({
      status: 404,
      description: 'یکی از دسته‌بندی‌ها یا مواد اولیه یافت نشد',
    }),
  );

export const ApiGetRecipes = () =>
  applyDecorators(
    ApiOperation({
      summary: 'دریافت لیست دستور پخت‌ها',
      description: 'لیست تمام دستور پخت‌ها را با قابلیت صفحه‌بندی برمی‌گرداند',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'شماره صفحه',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'تعداد آیتم در هر صفحه',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'لیست دستور پخت‌ها با موفقیت دریافت شد',
    }),
  );

export const ApiGetRecipe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'دریافت دستور پخت با آیدی',
      description: 'جزئیات کامل یک دستور پخت را با آیدی آن برمی‌گرداند',
    }),
    ApiParam({
      name: 'id',
      description: 'آیدی دستور پخت',
      example: '64a1b2c3d4e5f6789012345a',
    }),
    ApiResponse({
      status: 200,
      description: 'دستور پخت با موفقیت دریافت شد',
    }),
    ApiResponse({
      status: 404,
      description: 'دستور پخت یافت نشد',
    }),
  );

export const ApiUpdateRecipe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'به‌روزرسانی دستور پخت',
      description: 'اطلاعات یک دستور پخت را به‌روزرسانی می‌کند',
    }),
    ApiParam({
      name: 'id',
      description: 'آیدی دستور پخت',
      example: '64a1b2c3d4e5f6789012345a',
    }),
    ApiBody({
      description: 'اطلاعات جدید دستور پخت',
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'عنوان دستور پخت',
            example: 'قورمه سبزی',
          },
          description: {
            type: 'string',
            description: 'توضیحات دستور پخت',
            example: 'یک غذای سنتی و خوشمزه ایرانی',
          },
          instructions: {
            type: 'string',
            description: 'دستور پخت کامل',
            example: 'ابتدا گوشت را تفت دهید، سپس سبزیجات را اضافه کنید...',
          },
          categoryIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'آیدی دسته‌بندی‌های غذا',
            example: ['64a1b2c3d4e5f6789012345a', '64a1b2c3d4e5f6789012345b'],
          },
          ingredientIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'آیدی مواد اولیه مورد نیاز',
            example: ['64a1b2c3d4e5f6789012345c', '64a1b2c3d4e5f6789012345d'],
          },
          image: {
            type: 'string',
            description: 'آدرس تصویر غذا (اختیاری)',
            example: 'https://example.com/image.jpg',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'دستور پخت با موفقیت به‌روزرسانی شد',
    }),
    ApiResponse({
      status: 404,
      description: 'دستور پخت یافت نشد',
    }),
    ApiResponse({
      status: 409,
      description: 'دستور پخت با این عنوان قبلاً وجود دارد',
    }),
  );

export const ApiDeleteRecipe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'حذف دستور پخت',
      description: 'یک دستور پخت را از سیستم حذف می‌کند',
    }),
    ApiParam({
      name: 'id',
      description: 'آیدی دستور پخت',
      example: '64a1b2c3d4e5f6789012345a',
    }),
    ApiResponse({
      status: 204,
      description: 'دستور پخت با موفقیت حذف شد',
    }),
    ApiResponse({
      status: 404,
      description: 'دستور پخت یافت نشد',
    }),
  );

