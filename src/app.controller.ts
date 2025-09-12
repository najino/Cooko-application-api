import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return {
      version: '1.0.0',
      status: 'ok',
    };
  }
}
