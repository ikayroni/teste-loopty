import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from '@/database/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { CacheService } from '@/cache/cache.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { TasksGateway } from '@/websocket/websocket.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private cacheService: CacheService,
    private notificationsService: NotificationsService,
    @Inject(TasksGateway)
    private tasksGateway: TasksGateway,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
    });

    const savedTask = await this.tasksRepository.save(task);

    // Invalidate cache
    await this.cacheService.invalidateTasksCache(userId);

    // Notify all clients via WebSocket
    this.tasksGateway.notifyAllUpdates();

    // Send notification if high priority
    if (savedTask.priority === TaskPriority.HIGH) {
      await this.notificationsService.sendHighPriorityNotification(savedTask);
    }

    return savedTask;
  }

  async findAll(queryDto: QueryTaskDto, userId: string) {
    const { page = 1, limit = 10, status, priority, sortBy = 'createdAt', order = 'DESC' } = queryDto;

    // Try to get from cache
    const cacheKey = `tasks:${userId}:${JSON.stringify(queryDto)}`;
    const cachedData = await this.cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    // Build query
    const where: FindOptionsWhere<Task> = { userId };
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }

    const [tasks, total] = await this.tasksRepository.findAndCount({
      where,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const result = {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    await this.cacheService.set(cacheKey, result);

    return result;
  }

  async findOne(id: string, userId: string) {
    const task = await this.tasksRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id, userId);

    Object.assign(task, updateTaskDto);

    const updatedTask = await this.tasksRepository.save(task);

    // Invalidate cache
    await this.cacheService.invalidateTasksCache(userId);

    // Notify all clients via WebSocket
    this.tasksGateway.notifyAllUpdates();

    return updatedTask;
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id, userId);

    await this.tasksRepository.remove(task);

    // Invalidate cache
    await this.cacheService.invalidateTasksCache(userId);

    // Notify all clients via WebSocket
    this.tasksGateway.notifyAllUpdates();

    return { message: 'Tarefa deletada com sucesso' };
  }

  async getTaskStats(userId: string) {
    const tasks = await this.tasksRepository.find({ where: { userId } });

    return {
      total: tasks.length,
      byStatus: {
        pending: tasks.filter((t) => t.status === TaskStatus.PENDING).length,
        inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
        completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
      },
      byPriority: {
        low: tasks.filter((t) => t.priority === TaskPriority.LOW).length,
        medium: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
        high: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
      },
    };
  }
}
