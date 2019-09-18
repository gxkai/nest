import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { CatsController } from './cats/cats.controller';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.getDatabaseHost(),
      port: this.configService.getDatabasePort(),
      username: this.configService.getDatabaseUser(),
      password: this.configService.getDatabasePWD(),
      database: this.configService.getDatabaseDB(),
      synchronize: this.configService.getDatabaseSychronize(),
      dropSchema: this.configService.getDatabaseDropSchema(),
      entities: ['src/db/entity/*.ts'],
      migrations: ['src/db/migration/**/*.ts'],
      subscribers: ['src/db/subscriber/*.ts'],
    };
  }
}

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    ConfigModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(AuthMiddleware).exclude({path: 'login', method: RequestMethod.ALL})
      .forRoutes(AppController, CatsController);
  }
}
