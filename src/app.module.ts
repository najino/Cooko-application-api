import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UploaderModule } from './modules/uploader/uploader.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [PrismaModule, UploaderModule, CategoryModule],
  controllers: [AppController],
})
export class AppModule {}
