export interface Column {
  id: number;
  title: string;
  ownerId: number;
  order: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
