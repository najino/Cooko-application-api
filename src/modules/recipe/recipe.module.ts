import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IngredientModule } from '../ingredient/ingredient.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [PrismaModule, CategoryModule, IngredientModule],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
