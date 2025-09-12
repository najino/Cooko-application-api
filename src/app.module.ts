import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UploaderModule } from './modules/uploader/uploader.module';
import { CategoryModule } from './modules/category/category.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';

@Module({
  imports: [PrismaModule, UploaderModule, CategoryModule, IngredientModule],
  controllers: [AppController],
})
export class AppModule {}
