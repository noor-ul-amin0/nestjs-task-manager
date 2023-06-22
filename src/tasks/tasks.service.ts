import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { User } from 'src/auth/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import { TodolistService } from 'src/todolist/todolist.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    private todolistsService: TodolistService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const todolist = await this.todolistsService.getTodoListForUser(user.id);
    return this.taskModel.create({
      ...createTaskDto,
      userId: user.id,
      todoListId: todolist.id,
    });
  }

  async findAll(user: User): Promise<Task[]> {
    const todolist = await this.todolistsService.getTodoListForUser(user.id);
    if (!todolist) return [];
    return this.taskModel.findAll({ where: { todoListId: todolist.id } });
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const todolist = await this.todolistsService.getTodoListForUser(user.id);
    const task = await this.taskModel.findOne({
      where: { id, todoListId: todolist.id },
    });
    if (!task) throw new NotFoundException();
    return task.update({ ...updateTaskDto });
  }

  async remove(id: number, user: User): Promise<void> {
    const todolist = await this.todolistsService.getTodoListForUser(user.id);
    const task = await this.taskModel.findOne({
      where: { id, todoListId: todolist.id },
    });
    if (!task) throw new NotFoundException();
    return task.destroy();
  }

  async complete(id: number, user: User): Promise<Task> {
    const todolist = await this.todolistsService.getTodoListForUser(user.id);
    const task = await this.taskModel.findOne({
      where: { id, todoListId: todolist.id },
    });
    if (!task) throw new NotFoundException();
    if (task.completionStatus === true) return task;
    return task.update({
      completionStatus: true,
      completionDateTime: new Date(),
    });
  }

  async similar(user: User): Promise<Task[]> {
    const todolist = await this.todolistsService.getTodoListForUser(user.id);
    /*Return user a list of similar tasks. Two tasks A and B are considered similar if all the words in the task A exist in task B or vice versa.*/
    const tasks = await this.taskModel.findAll({
      where: { todoListId: todolist.id },
    });
    const similarTasks: Task[] = [];

    // Iterate through each task
    for (let i = 0; i < tasks.length; i++) {
      let isSimilar = false;

      // Compare task words with other tasks
      for (let j = 0; j < tasks.length; j++) {
        if (i !== j) {
          // Exclude the same task
          const taskWords = tasks[i].title.toLowerCase().split(' ');
          const otherTaskWords = tasks[j].title.toLowerCase().split(' ');

          // Check if all words in task A exist in task B or vice versa
          isSimilar =
            taskWords.every((word) => otherTaskWords.includes(word)) ||
            otherTaskWords.every((word) => taskWords.includes(word));

          if (isSimilar) break; // Found a similar task, no need to check further
        }
      }

      if (isSimilar) similarTasks.push(tasks[i]); // Add the similar task to the list
    }

    return similarTasks;
  }
}
