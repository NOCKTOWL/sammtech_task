import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BoardsController],
  providers: [PrismaService, BoardsService],
})
export class BoardsModule {}
