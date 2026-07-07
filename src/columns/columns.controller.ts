/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
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
import { CreateTaskDto } from 'src/tasks/dto/createTask.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Columns')
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

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
}
