import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  // getColumns(): string {
  //   return ['Column 1', 'Column 2', 'Column 3'].join(', ');
  // }

  // [POST] CREATE TASK IN COLUMN
  async createTaskInColumn(
    columnId: number,
    taskData: CreateTaskDto,
    userId: number,
  ): Promise<string> {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!column) {
      throw new NotFoundException(`Column with ID ${columnId} not found`);
    }

    const existingTaskCount = await this.prisma.task.count({
      where: { columnId },
    });

    const newTask = await this.prisma.task.create({
      data: {
        ...taskData,
        columnId,
        position: existingTaskCount + 1,
        createdById: userId,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return `Task '${newTask.title}' created in column '${column.title}'`;
  }

  // [PATCH] UPDATE COLUMN
  async update(
    columnId: number,
    body: Partial<{ title: string; order: number }>,
  ): Promise<string> {
    if (!body.title && body.order === undefined) {
      throw new BadRequestException(
        'At least one of title or order must be provided for update',
      );
    }

    const existingColumnInOrder = await this.prisma.column.findFirst({
      where: {
        order: body.order,
      },
    });

    if (existingColumnInOrder && existingColumnInOrder.id !== columnId) {
      await this.prisma.column.update({
        where: { id: existingColumnInOrder.id },
        data: { order: existingColumnInOrder.order + 1, updatedAt: new Date() },
      });
    }

    await this.prisma.column.update({
      where: { id: columnId },
      data: { ...body, updatedAt: new Date() },
    });
    return 'Column updated successfully';
  }

  // [DELETE] SOFT DELETE COLUMN
  async delete(columnId: number): Promise<string> {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!column) {
      throw new NotFoundException(`Column with ID ${columnId} not found`);
    }

    await this.prisma.column.update({
      where: { id: columnId },
      data: { deletedAt: new Date() },
    });

    return 'Column deleted successfully';
  }
}
