import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
// import { Task } from './task.entity.ts.temp';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaService } from 'src/prisma.service';

@Module({
  // imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
