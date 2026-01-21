import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CacheModule,
    AuthModule,
    TasksModule,
    AnalyticsModule,
    NotificationsModule,
    WebsocketModule,
  ],
})
export class AppModule {}
