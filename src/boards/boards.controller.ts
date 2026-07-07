/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/createBoard.dto';
import { BoardOwnerGuard } from 'src/guards/board-owner/board-owner.guard';
import { Roles } from 'src/guards/roles/roles.decorator';
import { Role } from 'src/guards/roles/roles.enums';
import type { Request } from 'express';
import { Board } from './interfaces/boards.interface';

@UseGuards(AuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @Roles(Role.BOARD_OWNER, Role.USER)
  getAllBoards(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Get(':id')
  @UseGuards(BoardOwnerGuard, RolesGuard)
  @Roles(Role.BOARD_OWNER, Role.USER)
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.findOne(id);
  }

  @Post()
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Req() req: Request,
  ): Promise<Board> {
    console.log('BoardsController - createBoard - Request User:', req['user']);
    return this.boardsService.create(createBoardDto, req['user']?.id);
  }

  @UseGuards(RolesGuard, BoardOwnerGuard)
  @Roles(Role.BOARD_OWNER)
  @Delete(':id')
  deleteBoard(@Param('id') id: string): Promise<string> {
    return this.boardsService.delete(id);
  }
}
