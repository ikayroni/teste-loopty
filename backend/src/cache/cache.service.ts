import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  private client: RedisClientType;
  private readonly logger = new Logger(CacheService.name);
  private readonly ttl: number;

  constructor(private configService: ConfigService) {
    this.ttl = this.configService.get('REDIS_TTL') || 300; // 5 minutes default
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      this.client = createClient({
        socket: {
          host: this.configService.get('REDIS_HOST'),
          port: this.configService.get('REDIS_PORT'),
        },
      });

      this.client.on('error', (err) => {
        this.logger.error('Redis Client Error', err);
      });

      await this.client.connect();
      this.logger.log('Redis connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key}`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.client.setEx(
        key,
        ttl || this.ttl,
        JSON.stringify(value),
      );
    } catch (error) {
      this.logger.error(`Error setting key ${key}`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      this.logger.error(`Error deleting pattern ${pattern}`, error);
    }
  }

  async invalidateTasksCache(userId: string): Promise<void> {
    await this.delPattern(`tasks:${userId}:*`);
  }

  async invalidateAnalyticsCache(userId: string): Promise<void> {
    await this.delPattern(`analytics:${userId}:*`);
  }
}
