import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super(
      process.env.NODE_ENV === 'development'
        ? {
            log: [
              {
                emit: 'event',
                level: 'query',
              },
              {
                emit: 'event',
                level: 'error',
              },
              {
                emit: 'event',
                level: 'info',
              },
              {
                emit: 'event',
                level: 'warn',
              },
            ],

            errorFormat: 'pretty',
          }
        : {
            errorFormat: 'pretty',
          },
    );
  }

  async onModuleInit() {
    try {
      this.logger.log('trying to connect to database...');
      await this.retry<void>(() => this.$connect());
      this.logger.log('✅ Database connection established successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('🔌 Database connection closed');
    } catch (error) {
      this.logger.error('❌ Error closing database connection:', error);
    }
  }

  private async retry<T>(fn: () => Promise<T>, retries = 3) {
    while (retries > 0) {
      try {
        return await fn();
      } catch (error) {
        this.logger.warn(`trying ${retries} times to reconnect to database...`);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            retries--;
            continue;
          }
        }
        throw error;
      }
    }
  }
}
