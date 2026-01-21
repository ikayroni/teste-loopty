import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova tarefa' })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() userId: string) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas com filtros e paginação' })
  findAll(@Query() queryDto: QueryTaskDto, @GetUser() userId: string) {
    return this.tasksService.findAll(queryDto, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa específica' })
  findOne(@Param('id') id: string, @GetUser() userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tarefa' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() userId: string,
  ) {
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar tarefa' })
  remove(@Param('id') id: string, @GetUser() userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
