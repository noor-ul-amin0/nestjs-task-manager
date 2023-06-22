import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import { TodoList } from './todolist.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/users.model';

@Injectable()
export class TodolistService {
  constructor(
    @InjectModel(TodoList)
    private todolistModel: typeof TodoList,
  ) {}
  async create(
    createTodolistDto: CreateTodolistDto,
    user: User,
  ): Promise<TodoList> {
    const todolist = await this.todolistModel.findOne({
      where: { userId: user.id },
      attributes: ['id'],
    });
    if (todolist)
      throw new ForbiddenException("You can't add more than one todo list");
    return await this.todolistModel.create({
      userId: user.id,
      ...createTodolistDto,
    });
  }

  findOne(user: User) {
    return this.todolistModel.findOne({
      where: { userId: user.id },
      include: 'tasks',
    });
  }
}
