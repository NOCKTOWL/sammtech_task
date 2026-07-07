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
  ParseIntPipe,
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
import {
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UpdateTaskPositionDto } from './dto/updateTaskPosition.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('tasks')
@ApiForbiddenResponse({ description: 'Unauthorized access' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // [GET] GET ALL TASKS
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiOkResponse({
    description: 'Successfully retrieved all tasks',
  })
  @Get()
  getAllTasks(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  // [GET] GET TASK BY ID
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved the task by ID',
  })
  @Get(':id')
  getTaskById(@Param('id') id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  // [POST] CREATE NEW TASK
  // @ApiOperation({ summary: 'Create a new task' })
  // @ApiOkResponse({
  //   description: 'Successfully created a new task',
  // })
  // @Post()
  // createTask(@Body() body: CreateTaskDto, @Req() req: Request): Promise<Task> {
  //   const userId = req['user']?.id;
  //   return this.tasksService.create(body, userId);
  // }

  // [PATCH] UPDATE TASK BY ID
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiOkResponse({
    description: 'Successfully updated the task by ID',
  })
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedTask: UpdateTaskDto,
  ): Promise<Task> {
    const taskToUpdate = {
      ...updatedTask,
      updatedAt: new Date(),
    };
    return this.tasksService.update(id, taskToUpdate);
  }

  // [PATCH] UPDATE TASK POSITION BY ID
  @ApiOperation({ summary: 'Update a task position by ID' })
  @ApiOkResponse({
    description: 'Successfully updated the task position by ID',
  })
  @Patch(':id/position')
  updateTaskPosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedTask: UpdateTaskPositionDto,
  ): Promise<Task> {
    const taskToUpdate = {
      ...updatedTask,
      updatedAt: new Date(),
    };
    return this.tasksService.updatePosition(id, taskToUpdate);
  }

  // [DELETE] SOFT DELETE TASK BY ID
  @ApiOperation({ summary: 'Soft delete a task by ID' })
  @ApiOkResponse({
    description: 'Successfully soft deleted the task by ID',
  })
  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.tasksService.delete(id);
  }
}
