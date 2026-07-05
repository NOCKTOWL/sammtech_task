/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
    private tasks = [
        { id: 1, title: 'Task 1', description: 'This is the first task', priority: 'high', dueDate: '2026-07-01', assignedId: 1, columnId: 1, position: 1, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Task 2', description: 'This is the second task', priority: 'medium', dueDate: '2026-07-02', assignedId: 2, columnId: 2, position: 2, deletedAt: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 3, title: 'Task 3', description: 'This is the third task', priority: 'low', dueDate: '2026-07-03', assignedId: 3, columnId: 3, position: 3, deletedAt: null, createdAt: new Date(), updatedAt: new Date() }
    ];

    getAllTasks() {
        return this.tasks;
    }

    getTaskById(id: number) {
        const task = this.tasks.find(task => task.id === id);
        
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    // [POST] CREATE NEW TASK
    createTask(task: { title: string; description: string; priority: string; dueDate: string; assignedId: number ; columnId: number; position: number }) {
        const newTask = {
            id: this.tasks.length + 1,
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...task
        };
        this.tasks.push(newTask);
        return newTask;
    }

    // [PUT] UPDATE EXISTING TASK
    updateTask(id: number, updatedTask: {title?: string; description?: string; priority?: string; dueDate?: string; assignedId?: number ; columnId?: number; position?: number }) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        
        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updatedTask,
            updatedAt: new Date()
        };

        return this.tasks[taskIndex];
        
    }

    // [PATCH] PARTIALLY UPDATE TASK
    partiallyUpdateTask(id: number, updatedFields: Partial<{title?: string; description?: string; priority?: string; dueDate?: string; assignedId?: number ; columnId?: number; position?: number }>) {
        const task = this.getTaskById(id);

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        Object.assign(task, updatedFields, { updatedAt: new Date() });

        return task;
    }

    // [DELETE] DELETE TASK
    deleteTask(id: number) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        const deletedTask = this.tasks[taskIndex];
        this.tasks.splice(taskIndex, 1);
        return { message: `Task with ID ${id} has been deleted`, task: deletedTask };
    }
}
