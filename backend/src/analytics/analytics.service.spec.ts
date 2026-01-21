import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { Task, TaskStatus, TaskPriority } from '@/database/entities/task.entity';
import { CacheService } from '@/cache/cache.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockTasksRepository: any;
  let mockCacheService: any;

  beforeEach(async () => {
    mockTasksRepository = {
      find: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getOverview', () => {
    it('should return overview metrics', async () => {
      const mockTasks = [
        {
          id: '1',
          status: TaskStatus.COMPLETED,
          priority: TaskPriority.HIGH,
          dueDate: null,
        },
        {
          id: '2',
          status: TaskStatus.PENDING,
          priority: TaskPriority.MEDIUM,
          dueDate: null,
        },
        {
          id: '3',
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.LOW,
          dueDate: null,
        },
      ];

      mockCacheService.get.mockResolvedValue(null);
      mockTasksRepository.find.mockResolvedValue(mockTasks);

      const result = await service.getOverview('user-123');

      expect(result).toHaveProperty('total', 3);
      expect(result).toHaveProperty('completed', 1);
      expect(result).toHaveProperty('pending', 1);
      expect(result).toHaveProperty('inProgress', 1);
      expect(result).toHaveProperty('completionRate');
      // Cache removido do analytics para tempo real via WebSocket
    });

    it('should always fetch fresh data (no cache)', async () => {
      const mockTasks = [
        {
          id: '1',
          status: TaskStatus.COMPLETED,
          priority: TaskPriority.HIGH,
          dueDate: null,
        },
      ];

      mockTasksRepository.find.mockResolvedValue(mockTasks);

      const result = await service.getOverview('user-123');

      expect(result).toHaveProperty('total', 1);
      expect(mockTasksRepository.find).toHaveBeenCalled();
    });
  });

  describe('getProductivity', () => {
    it('should calculate productivity metrics', async () => {
      const mockTasks = [
        {
          id: '1',
          status: TaskStatus.COMPLETED,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          updatedAt: new Date(),
        },
        {
          id: '2',
          status: TaskStatus.COMPLETED,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          updatedAt: new Date(),
        },
      ];

      mockCacheService.get.mockResolvedValue(null);
      mockTasksRepository.find.mockResolvedValue(mockTasks);

      const result = await service.getProductivity('user-123');

      expect(result).toHaveProperty('tasksLast7Days');
      expect(result).toHaveProperty('completedLast7Days');
      expect(result).toHaveProperty('avgCompletionTime');
      expect(result).toHaveProperty('productivityScore');
    });
  });
});
