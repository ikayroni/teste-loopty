import { Module } from '@nestjs/common';
import { TasksGateway } from './websocket.gateway';

@Module({
  providers: [TasksGateway],
  exports: [TasksGateway],
})
export class WebsocketModule {}
