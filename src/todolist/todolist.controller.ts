import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/users.model';
import { TodoList } from './todolist.model';

@Controller('todolist')
@UseGuards(AuthGuard())
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Post()
  create(
    @Body() createTodolistDto: CreateTodolistDto,
    @GetUser() user: User,
  ): Promise<TodoList> {
    return this.todolistService.create(createTodolistDto, user);
  }
  @Get()
  get(@GetUser() user: User): Promise<TodoList> {
    return this.todolistService.findOne(user);
  }
}
