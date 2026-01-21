import { IsString, IsEnum, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '@/database/entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar autenticação' })
  @IsString()
  @MinLength(3, { message: 'Título deve ter no mínimo 3 caracteres' })
  @MaxLength(200, { message: 'Título deve ter no máximo 200 caracteres' })
  title: string;

  @ApiPropertyOptional({ example: 'Implementar JWT e proteção de rotas' })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' })
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status inválido' })
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, example: TaskPriority.HIGH })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Prioridade inválida' })
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: '2026-01-25' })
  @IsOptional()
  @IsDateString({ strict: false }, { message: 'Data de vencimento inválida' })
  dueDate?: string;
}
