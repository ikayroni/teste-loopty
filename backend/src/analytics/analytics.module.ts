import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@/database/entities/task.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { CacheModule } from '@/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CacheModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
