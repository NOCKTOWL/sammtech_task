/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ColumnsService {
    getColumns(): string {
        return ['Column 1', 'Column 2', 'Column 3'].join(', ');
    }
}
