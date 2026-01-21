import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { NotificationsWorker } from './notifications.worker';

@Module({
  imports: [ConfigModule],
  providers: [NotificationsService, NotificationsWorker],
  exports: [NotificationsService],
})
export class NotificationsModule {}
