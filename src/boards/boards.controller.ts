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
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/createBoard.dto';
import { BoardOwnerGuard } from 'src/guards/board-owner/board-owner.guard';
import { Roles } from 'src/guards/roles/roles.decorator';
import { Role } from 'src/guards/roles/roles.enums';
import type { Request } from 'express';
import { Board } from './interfaces/boards.interface';
import { CreateColumnDto } from './dto/createColumn.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiOkResponse({ description: 'Boards returned successfully' })
  @Roles(Role.BOARD_OWNER, Role.USER)
  getAllBoards(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a board by ID' })
  @ApiParam({ name: 'id', description: 'Board ID' })
  @ApiOkResponse({ description: 'Board returned successfully' })
  @ApiNotFoundResponse({ description: 'Board not found' })
  @UseGuards(BoardOwnerGuard, RolesGuard)
  @Roles(Role.BOARD_OWNER, Role.USER)
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiCreatedResponse({ description: 'Board created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid board data' })
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Req() req: Request,
  ): Promise<Board> {
    console.log('BoardsController - createBoard - Request User:', req['user']);
    return this.boardsService.create(createBoardDto, req['user']?.id);
  }

  @UseGuards(RolesGuard, BoardOwnerGuard)
  @ApiOperation({ summary: 'Delete a board by ID' })
  @ApiParam({ name: 'id', description: 'Board ID' })
  @ApiOkResponse({ description: 'Board deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Roles(Role.BOARD_OWNER)
  @Delete(':id')
  deleteBoard(@Param('id') id: string): Promise<string> {
    return this.boardsService.delete(id);
  }

  @UseGuards(RolesGuard, BoardOwnerGuard)
  @ApiOperation({ summary: 'Create a column inside a board' })
  @ApiParam({ name: 'id', description: 'Board ID' })
  @ApiCreatedResponse({ description: 'Column created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid column data' })
  @Roles(Role.BOARD_OWNER)
  @Post(':id/columns')
  createColumn(
    @Body() createColumnDto: CreateColumnDto,
    @Param('id') boardId: number,
  ) {
    console.log('BoardsController - createColumn - Board ID:', boardId);
    return this.boardsService.createColumn(createColumnDto, boardId);
  }
}
