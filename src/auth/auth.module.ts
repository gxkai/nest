import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../db/entity/user.entity';
const jwt = (): DynamicModule => {
  const config = new ConfigService();
  return JwtModule.register({
    secret: config.getJwtSecret(),
    signOptions: { expiresIn: '86400s' },
  });
};
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    jwt(),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
