import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';

@Injectable()
export class NotificationsWorker implements OnModuleInit {
  private readonly logger = new Logger(NotificationsWorker.name);
  private connection: any;
  private channelWrapper: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.startWorker();
  }

  private async startWorker() {
    try {
      const rabbitUrl = this.configService.get('RABBITMQ_URL');
      const queueName = this.configService.get('RABBITMQ_QUEUE');

      this.connection = amqp.connect([rabbitUrl]);
      
      this.channelWrapper = this.connection.createChannel({
        json: true,
        setup: async (channel: any) => {
          await channel.assertQueue(queueName, { durable: true });
          await channel.prefetch(1);
          
          await channel.consume(queueName, async (msg: any) => {
            if (msg) {
              try {
                const notification = JSON.parse(msg.content.toString());
                await this.processNotification(notification);
                channel.ack(msg);
              } catch (error) {
                this.logger.error('Error processing message', error);
                channel.nack(msg, false, false);
              }
            }
          });
        },
      });

      this.logger.log('RabbitMQ worker started successfully');
    } catch (error) {
      this.logger.error('Failed to start RabbitMQ worker', error);
    }
  }

  private async processNotification(notification: any): Promise<void> {
    this.logger.log(`Processing notification for task: ${notification.taskId}`);
    this.logger.log(`Title: ${notification.title}`);
    this.logger.log(`Priority: ${notification.priority}`);
    this.logger.log(`User: ${notification.userId}`);
    
    // Simulate sending notification (email, push, etc.)
    // In production, you would integrate with services like:
    // - SendGrid for emails
    // - Firebase Cloud Messaging for push notifications
    // - Twilio for SMS
    
    this.logger.log('✅ Notification processed successfully');
  }
}
