import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Task } from './interfaces/task.interface';
import { UpdateTaskPositionDto } from './dto/update-task-position.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // private tasks = [
  //     { id: 1, title: 'Task 1', description: 'This is the first task', priority: 'high', dueDate: '2026-07-01', assignedId: 1, columnId: 1, position: 1, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
  //     { id: 2, title: 'Task 2', description: 'This is the second task', priority: 'medium', dueDate: '2026-07-02', assignedId: 2, columnId: 2, position: 2, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
  //     { id: 3, title: 'Task 3', description: 'This is the third task', priority: 'low', dueDate: '2026-07-03', assignedId: 3, columnId: 3, position: 3, deletedAt: null, createdAt: new Date(), updatedAt: new Date() }
  // ];

  // [GET] GET ALL TASKS
  async findAll(filters: FilterTasksDto): Promise<Task[]> {
    const { title, priority, dueDate } = filters;

    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
        ...(priority && { priority }),
        ...(dueDate && {
          dueDate: {
            gte: dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : undefined,
            lte: dueDate ? new Date(`${dueDate}T23:59:59.999Z`) : undefined,
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // for real world scenario maybe deleted tasks won't be fetched
  // async findAll(): Promise<Task[]> {
  //   return this.prisma.task.findMany({
  //     where: {
  //       deletedAt: null,
  //     },
  //   });
  // }

  // [GET] GET TASK BY ID
  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  // [PATCH] UPDATE EXISTING TASK
  async update(id: number, updatedTask: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updatedTaskData = {
      ...task,
      ...updatedTask,
      updatedAt: new Date(),
    };

    const updatedTaskRecord = await this.prisma.task.update({
      where: { id },
      data: updatedTaskData,
    });

    return updatedTaskRecord;
  }

  async updatePosition(
    id: number,
    updatedTask: UpdateTaskPositionDto,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const existingTaskInPosition = await this.prisma.task.findFirst({
      where: {
        position: updatedTask.position,
        columnId: task.columnId,
      },
    });

    if (existingTaskInPosition && existingTaskInPosition.id !== id) {
      await this.prisma.task.update({
        where: { id: existingTaskInPosition.id },
        data: {
          position: existingTaskInPosition.position + 1,
          updatedAt: new Date(),
        },
      });
    }

    const updatedTaskData = {
      ...task,
      ...updatedTask,
      updatedAt: new Date(),
    };

    const updatedTaskRecord = await this.prisma.task.update({
      where: { id },
      data: updatedTaskData,
    });

    return updatedTaskRecord;
  }

  // [DELETE] SOFT DELETE TASK BY ID
  async delete(id: number): Promise<{ message: string }> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.deletedAt) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: `Task with ID ${id} has been deleted` };
  }
}
