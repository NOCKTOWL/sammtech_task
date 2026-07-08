import { Priority } from 'src/generated/prisma/client';

export interface Task {
  id: number;
  title: string;
  createdById: number;
  description: string | null;
  priority: Priority;
  dueDate: Date | null;
  assignedId: number | null;
  columnId: number;
  position: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
