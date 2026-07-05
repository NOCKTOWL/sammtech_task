/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';

@Controller('boards')
export class BoardsController {
    @Get()
    getboards(): string {
    return 'Boards endpoint';
    }
}
