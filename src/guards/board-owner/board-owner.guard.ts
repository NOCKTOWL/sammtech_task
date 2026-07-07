/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

import { BoardsService } from 'src/boards/boards.service';

@Injectable()
export class BoardOwnerGuard implements CanActivate {
  constructor(private readonly boardsService: BoardsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const userId = Number(request['user']?.id);

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const boardOwnerId =
      await this.boardsService.getBoardOwnerIdFromRequest(request);

    if (boardOwnerId === undefined) {
      throw new NotFoundException('Board owner ID not found');
    }

    return userId === boardOwnerId;
  }
}
