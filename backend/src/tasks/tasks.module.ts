import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@/database/entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CacheModule } from '@/cache/cache.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { WebsocketModule } from '@/websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    CacheModule,
    NotificationsModule,
    WebsocketModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
