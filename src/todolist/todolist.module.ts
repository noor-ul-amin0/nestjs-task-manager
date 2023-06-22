import { Module } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { TodolistController } from './todolist.controller';
import { TodoList } from './todolist.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from 'src/tasks/tasks.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([TodoList, Task]), AuthModule],
  controllers: [TodolistController],
  providers: [TodolistService],
  exports: [TodolistService],
})
export class TodolistModule {}
