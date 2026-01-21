import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Task } from '@/database/entities/task.entity';
import * as amqp from 'amqp-connection-manager';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private connection: any;
  private channelWrapper: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const rabbitUrl = this.configService.get('RABBITMQ_URL');
    this.connection = amqp.connect([rabbitUrl]);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: any) => {
        const queueName = this.configService.get('RABBITMQ_QUEUE');
        await channel.assertQueue(queueName, { durable: true });
      },
    });
    this.logger.log('RabbitMQ producer initialized');
  }

  async sendHighPriorityNotification(task: Task): Promise<void> {
    try {
      const notification = {
        taskId: task.id,
        title: task.title,
        priority: task.priority,
        userId: task.userId,
        createdAt: task.createdAt,
      };

      const queueName = this.configService.get('RABBITMQ_QUEUE');
      await this.channelWrapper.sendToQueue(
        queueName,
        notification,
        { persistent: true }
      );
      
      this.logger.log(`Notification sent for high priority task: ${task.id}`);
    } catch (error) {
      this.logger.error('Error sending notification', error);
    }
  }
}
