import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('TasksGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Emitir evento quando houver mudança nas tasks
  notifyTasksUpdate() {
    this.server.emit('tasks:updated', { timestamp: new Date() });
    this.logger.log('Emitted tasks:updated event');
  }

  // Emitir evento quando houver mudança nas analytics
  notifyAnalyticsUpdate() {
    this.server.emit('analytics:updated', { timestamp: new Date() });
    this.logger.log('Emitted analytics:updated event');
  }

  // Emitir ambos os eventos
  notifyAllUpdates() {
    this.notifyTasksUpdate();
    this.notifyAnalyticsUpdate();
  }
}
