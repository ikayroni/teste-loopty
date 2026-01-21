import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from '@/database/entities/task.entity';
import { CacheService } from '@/cache/cache.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { TasksGateway } from '@/websocket/websocket.gateway';

describe('TasksService', () => {
  let service: TasksService;
  let mockTasksRepository: any;
  let mockCacheService: any;
  let mockNotificationsService: any;
  let mockTasksGateway: any;

  beforeEach(async () => {
    mockTasksRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      invalidateTasksCache: jest.fn(),
    };

    mockNotificationsService = {
      sendHighPriorityNotification: jest.fn(),
    };

    mockTasksGateway = {
      notifyAllUpdates: jest.fn(),
      notifyTasksUpdate: jest.fn(),
      notifyAnalyticsUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: TasksGateway,
          useValue: mockTasksGateway,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
      };

      const userId = 'user-123';
      const mockTask = {
        id: 'task-123',
        ...createTaskDto,
        userId,
      };

      mockTasksRepository.create.mockReturnValue(mockTask);
      mockTasksRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, userId);

      expect(result).toEqual(mockTask);
      expect(mockCacheService.invalidateTasksCache).toHaveBeenCalledWith(userId);
      expect(mockNotificationsService.sendHighPriorityNotification).not.toHaveBeenCalled();
    });

    it('should send notification for high priority task', async () => {
      const createTaskDto = {
        title: 'Urgent Task',
        priority: TaskPriority.HIGH,
      };

      const userId = 'user-123';
      const mockTask = {
        id: 'task-123',
        ...createTaskDto,
        userId,
      };

      mockTasksRepository.create.mockReturnValue(mockTask);
      mockTasksRepository.save.mockResolvedValue(mockTask);

      await service.create(createTaskDto, userId);

      expect(mockNotificationsService.sendHighPriorityNotification).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('findOne', () => {
    it('should return a task if found', async () => {
      const mockTask = {
        id: 'task-123',
        title: 'Test Task',
        userId: 'user-123',
      };

      mockTasksRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('task-123', 'user-123');

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTasksRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('task-123', 'user-123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const mockTask = {
        id: 'task-123',
        title: 'Old Title',
        userId: 'user-123',
      };

      const updateDto = {
        title: 'New Title',
      };

      mockTasksRepository.findOne.mockResolvedValue(mockTask);
      mockTasksRepository.save.mockResolvedValue({
        ...mockTask,
        ...updateDto,
      });

      const result = await service.update('task-123', updateDto, 'user-123');

      expect(result.title).toBe('New Title');
      expect(mockCacheService.invalidateTasksCache).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const mockTask = {
        id: 'task-123',
        title: 'Test Task',
        userId: 'user-123',
      };

      mockTasksRepository.findOne.mockResolvedValue(mockTask);
      mockTasksRepository.remove.mockResolvedValue(mockTask);

      const result = await service.remove('task-123', 'user-123');

      expect(result.message).toBe('Tarefa deletada com sucesso');
      expect(mockCacheService.invalidateTasksCache).toHaveBeenCalled();
    });
  });
});
