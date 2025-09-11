import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UploaderModule } from './modules/uploader/uploader.module';

@Module({
  imports: [PrismaModule, UploaderModule],
  controllers: [AppController],
})
export class AppModule {}
