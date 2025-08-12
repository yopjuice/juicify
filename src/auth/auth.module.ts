import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../config/jwt.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { YandexStrategy } from './strategies/yandex.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    JwtStrategy,
    process.env.GOOGLE_CLIENT_ID ? GoogleStrategy : {
      provide: GoogleStrategy,
      useValue: null
    },
    process.env.YANDEX_CLIENT_ID ? YandexStrategy : {
      provide: YandexStrategy,
      useValue: null
    },
  ],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtConfig,
    })
  ],
})
export class AuthModule { }
