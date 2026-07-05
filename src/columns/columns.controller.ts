/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { ColumnsService } from './columns.service';

@Controller('columns')
export class ColumnsController {
    constructor(private readonly columnsService: ColumnsService) {}
    
    @Get()
    getAllColumns(): string {
        return this.columnsService.getColumns();
    }
}
