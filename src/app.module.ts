import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlist/playlist.module';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 1 * 60 * 1000,
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PlaylistModule,
    TrackModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
