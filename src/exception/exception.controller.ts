/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseIntPipe, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception/http-exception.filter';

@Controller('exception')
@UseFilters(HttpExceptionFilter)
export class ExceptionController {
    @Get("hello/:id")
    getHello(@Param('id', ParseIntPipe) id: number): { message: string } {
        return {message: `Hello, your id is ${id}`};
    }
}
