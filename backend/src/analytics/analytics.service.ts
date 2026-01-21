import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from '@/database/entities/task.entity';
import { CacheService } from '@/cache/cache.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private cacheService: CacheService,
  ) {}

  async getOverview(userId: string) {
    // SEM CACHE - dados sempre em tempo real via WebSocket
    const tasks = await this.tasksRepository.find({ where: { userId } });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const pending = tasks.filter((t) => t.status === TaskStatus.PENDING).length;
    const inProgress = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;

    const highPriority = tasks.filter((t) => t.priority === TaskPriority.HIGH).length;
    const overdue = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== TaskStatus.COMPLETED,
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const result = {
      total,
      completed,
      pending,
      inProgress,
      highPriority,
      overdue,
      completionRate,
      byStatus: {
        pending,
        inProgress,
        completed,
      },
      byPriority: {
        low: tasks.filter((t) => t.priority === TaskPriority.LOW).length,
        medium: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
        high: highPriority,
      },
    };

    return result;
  }

  async getProductivity(userId: string) {
    // SEM CACHE - dados sempre em tempo real via WebSocket
    const tasks = await this.tasksRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Last 7 days productivity
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentTasks = tasks.filter((t) => new Date(t.createdAt) >= last7Days);
    const completedRecent = recentTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;

    // Average time to complete (in days)
    const completedTasks = tasks.filter((t) => t.status === TaskStatus.COMPLETED);
    let avgCompletionTime = 0;
    
    if (completedTasks.length > 0) {
      const totalDays = completedTasks.reduce((acc, task) => {
        const created = new Date(task.createdAt).getTime();
        const updated = new Date(task.updatedAt).getTime();
        const days = (updated - created) / (1000 * 60 * 60 * 24);
        return acc + days;
      }, 0);
      
      avgCompletionTime = Math.round(totalDays / completedTasks.length * 10) / 10;
    }

    // Tasks created vs completed (last 30 days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const createdLast30 = tasks.filter((t) => new Date(t.createdAt) >= last30Days).length;
    const completedLast30 = tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED && new Date(t.updatedAt) >= last30Days,
    ).length;

    const result = {
      tasksLast7Days: recentTasks.length,
      completedLast7Days: completedRecent,
      avgCompletionTime,
      tasksCreatedLast30Days: createdLast30,
      tasksCompletedLast30Days: completedLast30,
      productivityScore: this.calculateProductivityScore(tasks),
    };

    return result;
  }

  async getTrends(userId: string) {
    // SEM CACHE - dados sempre em tempo real via WebSocket
    const tasks = await this.tasksRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });

    // Group by week (last 8 weeks)
    const weeks = 8;
    const weeklyData = [];
    
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekTasks = tasks.filter((t) => {
        const created = new Date(t.createdAt);
        return created >= weekStart && created < weekEnd;
      });

      const completed = weekTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;

      weeklyData.push({
        week: `Semana ${weeks - i}`,
        created: weekTasks.length,
        completed,
        pending: weekTasks.length - completed,
      });
    }

    // Daily completions (last 7 days)
    const dailyData = [];
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayTasks = tasks.filter((t) => {
        const updated = new Date(t.updatedAt);
        return (
          updated >= date &&
          updated < nextDay &&
          t.status === TaskStatus.COMPLETED
        );
      });

      dailyData.push({
        day: days[date.getDay()],
        completed: dayTasks.length,
      });
    }

    const result = {
      weeklyTrends: weeklyData,
      dailyCompletions: dailyData,
    };

    return result;
  }

  private calculateProductivityScore(tasks: Task[]): number {
    if (tasks.length === 0) return 0;

    const completed = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const total = tasks.length;
    const completionRate = completed / total;

    // Factor in high priority tasks completed
    const highPriorityCompleted = tasks.filter(
      (t) => t.priority === TaskPriority.HIGH && t.status === TaskStatus.COMPLETED,
    ).length;
    const highPriority = tasks.filter((t) => t.priority === TaskPriority.HIGH).length;
    const priorityRate = highPriority > 0 ? highPriorityCompleted / highPriority : 1;

    // Factor in overdue tasks (negative impact)
    const overdue = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== TaskStatus.COMPLETED,
    ).length;
    const overdueRate = total > 0 ? overdue / total : 0;

    // Calculate score (0-100)
    const score = Math.round(
      (completionRate * 0.5 + priorityRate * 0.3 - overdueRate * 0.2) * 100,
    );

    return Math.max(0, Math.min(100, score));
  }
}
