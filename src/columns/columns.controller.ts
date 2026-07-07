import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ColumnsService } from './columns.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('columns')
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all columns' })
  @ApiOkResponse({ description: 'Columns returned successfully' })
  getAllColumns(): string {
    return this.columnsService.getColumns();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a column by ID' })
  @ApiParam({ name: 'id', description: 'Column ID' })
  @ApiOkResponse({ description: 'Column updated successfully' })
  updateColumn(
    @Param('id') columnId: number,
    @Body() body: Partial<{ title: string; order: number }>,
  ): Promise<string> {
    return this.columnsService
      .update(columnId, body)
      .then(() => 'Column updated successfully');
  }
}
