/* eslint-disable prettier/prettier */
export interface Board {
  id: number;
  title: string;
  ownerId: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
