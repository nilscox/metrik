import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserModule } from '../user/infrastructure/user.module';

import { UserMiddleware } from './user.middleware';

@Module({
  imports: [UserModule],
})
export class AuthorizationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
