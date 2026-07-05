/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    getAllTasks() {
        return this.tasksService.getAllTasks();
    }

    @Get(':id')
    getTaskById(@Param('id') id: string) {
        return this.tasksService.getTaskById(Number(id));
    }

    @Post()
    createTask(@Body() task: { title: string; description: string; priority: string; dueDate: string; assignedId: number; columnId: number; position: number }) {
        return this.tasksService.createTask(task);
    }

    @Put(':id')
    updateTask(@Param('id') id: string, @Body() updatedTask: { title?: string; description?: string; priority?: string; dueDate?: string; assignedId?: number; columnId?: number; position?: number }) {
        return this.tasksService.updateTask(Number(id), updatedTask);
    }

    @Patch(':id')
    partiallyUpdateTask(@Param('id') id: string, @Body() updatedFields: Partial<{ title?: string; description?: string; priority?: string; dueDate?: string; assignedId?: number; columnId?: number; position?: number }>) {
        return this.tasksService.partiallyUpdateTask(Number(id), updatedFields);
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string) {
        return this.tasksService.deleteTask(Number(id));
    }
}
