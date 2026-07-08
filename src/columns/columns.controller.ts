/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ColumnsService } from './columns.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Columns')
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  // [POST] CREATE TASK IN COLUMN
  @Post(':id/tasks')
  @ApiOperation({ summary: 'Create a task in a column' })
  @ApiParam({ name: 'id', description: 'Column ID' })
  createTaskInColumn(
    @Param('id', ParseIntPipe) columnId: number,
    @Body() taskData: CreateTaskDto,
    @Req() req: Request,
  ): Promise<string> {
    const userId: number = req['user']?.id;
    return this.columnsService.createTaskInColumn(columnId, taskData, userId);
  }

  // [PATCH] UPDATE COLUMN BY ID
  @Patch(':id')
  @ApiOperation({ summary: 'Update a column by ID' })
  @ApiParam({ name: 'id', description: 'Column ID' })
  @ApiOkResponse({ description: 'Column updated successfully' })
  updateColumn(
    @Param('id', ParseIntPipe) columnId: number,
    @Body() body: Partial<{ title: string; order: number }>,
  ): Promise<string> {
    return this.columnsService
      .update(columnId, body)
      .then(() => 'Column updated successfully');
  }

  // [DELETE] SOFT DELETE COLUMN BY ID
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a column by ID' })
  @ApiParam({ name: 'id', description: 'Column ID' })
  @ApiOkResponse({ description: 'Column soft deleted successfully' })
  softDeleteColumn(
    @Param('id', ParseIntPipe) columnId: number,
  ): Promise<string> {
    return this.columnsService
      .delete(columnId)
      .then(() => 'Column soft deleted successfully');
  }
}
