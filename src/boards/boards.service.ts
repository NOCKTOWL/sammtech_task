import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { Board } from './interfaces/boards.interface';
// import { CreateBoardDto } from './dto/createBoard.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateBoardDto } from './dto/createBoard.dto';
import type { Request } from 'express';
import { Role } from 'src/generated/prisma/browser';
import { CreateColumnDto } from './dto/createColumn.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}
  //   private boards: Board[] = [
  //     {
  //       id: '1',
  //       title: 'Board 1',
  //       ownerId: 'user1',
  //       deletedAt: null,
  //       createdAt: new Date(),
  //     },
  //     {
  //       id: '2',
  //       title: 'Board 2',
  //       ownerId: 'user2',
  //       deletedAt: null,
  //       createdAt: new Date(),
  //     },
  //     {
  //       id: '3',
  //       title: 'Board 3',
  //       ownerId: 'user3',
  //       deletedAt: null,
  //       createdAt: new Date(),
  //     },
  //   ];

  // [GET] GET ALL BOARDS
  async findAll(): Promise<Board[]> {
    return this.prisma.board.findMany();
  }

  // [GET] GET BOARD BY ID
  async findOne(id: number): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: { id, deletedAt: null },
      include: {
        columns: {
          where: { deletedAt: null },
          orderBy: {
            order: 'asc',
          },
          include: {
            tasks: {
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  // [GET] GET ALL BOARDS BY OWNER ID
  async getAllBoardsByOwnerId(ownerId: number): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: { ownerId, deletedAt: null },
    });
  }

  async getBoardOwnerIdFromRequest(@Req() req: Request): Promise<number> {
    const boardId = req.params.id;
    if (!boardId) {
      throw new NotFoundException('Board ID not found in request');
    }
    const board = await this.findOne(Number(boardId));
    return board?.ownerId;
  }

  // [POST] CREATE NEW BOARD
  async create(
    createBoardDto: CreateBoardDto,
    ownerId: number,
  ): Promise<Board> {
    const newBoard = await this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        ownerId: ownerId,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    await this.prisma.user.update({
      where: { id: ownerId },
      data: { role: Role.BOARD_OWNER },
    });
    return newBoard;
  }

  async update(id: number, updatedBoard: Partial<Board>): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    const updatedBoardData = {
      ...board,
      ...updatedBoard,
      updatedAt: new Date(),
    };

    const updatedBoardRecord = await this.prisma.board.update({
      where: { id },
      data: updatedBoardData,
    });

    return updatedBoardRecord;
  }

  async delete(id: number): Promise<string> {
    console.log('Deleting board with ID:', id);
    const board = await this.prisma.board.findUnique({
      where: { id },
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    await this.prisma.board.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.getAllBoardsByOwnerId(board.ownerId).then(async (boards) => {
      if (boards.length === 0) {
        await this.prisma.user.update({
          where: { id: board.ownerId },
          data: { role: Role.USER },
        });
      }
    });

    return `Board with ID ${id} deleted successfully`;
  }

  async createColumn(createColumnDto: CreateColumnDto, boardId: number) {
    console.log('BoardsService - createColumn - Board ID:', boardId);
    const existingColumnsInBoardLength = await this.prisma.column.count({
      where: { boardId },
    });
    return this.prisma.column.create({
      data: {
        title: createColumnDto.title,
        boardId: boardId,
        order: existingColumnsInBoardLength + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
