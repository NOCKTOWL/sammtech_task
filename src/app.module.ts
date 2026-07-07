import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { UsersModule } from './users/users.module';
import { ExceptionController } from './exception/exception.controller';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    BoardsModule,
    ColumnsModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TasksModule,
    AuthModule,
  ],
  controllers: [AppController, ExceptionController],
  providers: [AppService],
})
export class AppModule {}
