/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';
import { BoardsModule } from './boards/boards.module';
import { BoardsService } from './boards/boards.service';
import { BoardsController } from './boards/boards.controller';
import { ColumnsModule } from './columns/columns.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [BoardsModule, ColumnsModule, UsersModule],
  controllers: [AppController, UsersController, TasksController, BoardsController],
  providers: [AppService, TasksService, BoardsService, UsersService],
})
export class AppModule {}
