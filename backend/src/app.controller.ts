import { Controller, Get } from '@nestjs/common';

import { DatabaseService } from './common/database';

@Controller()
export class AppController {
  constructor(private readonly database: DatabaseService) {}

  @Get('healthcheck')
  async healthcheck(): Promise<Record<string, boolean>> {
    return {
      api: true,
      db: await this.database.checkConnection(),
    };
  }
}
