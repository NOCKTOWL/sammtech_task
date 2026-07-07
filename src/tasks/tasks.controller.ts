/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CreateTaskDto } from './dto/createTask.dto';
import { Task } from './interfaces/task.interface';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // [GET] GET ALL TASKS
  @Get()
  getAllTasks(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  // [GET] GET TASK BY ID
  @Get(':id')
  getTaskById(@Param('id') id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  // [POST] CREATE NEW TASK
  @Post()
  createTask(@Body() body: CreateTaskDto, @Req() req: Request): Promise<Task> {
    const userId = req['user']?.id;
    return this.tasksService.create(body, userId);
  }

  // [PUT] UPDATE TASK BY ID
  @Put(':id')
  updateTask(
    @Param('id') id: number,
    @Body() updatedTask: Partial<Task>,
  ): Promise<Task> {
    const taskToUpdate = {
      ...updatedTask,
      updatedAt: new Date(),
    };
    return this.tasksService.update(id, taskToUpdate);
  }

  // [DELETE] SOFT DELETE TASK BY ID
  @Delete(':id')
  deleteTask(@Param('id') id: number): Promise<{ message: string }> {
    return this.tasksService.delete(id);
  }
}
