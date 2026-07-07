/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  getColumns(): string {
    return ['Column 1', 'Column 2', 'Column 3'].join(', ');
  }

  async update(
    columnId: number,
    body: Partial<{ title: string; order: number }>,
  ): Promise<string> {
    if (!body.title && body.order === undefined) {
      throw new Error(
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
}
