import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/users.model';
import { Task } from './tasks.model';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseInterceptors(FilesInterceptor('fileAttachments', 5))
  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ): Promise<Task> {
    if (files && files.length) {
      const filePaths = files.map((file) => file.path);
      createTaskDto.fileAttachments = filePaths;
    }
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.findAll(user);
  }

  @Get('similar')
  similar(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.similar(user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.update(+id, updateTaskDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.remove(+id, user);
  }

  @Put(':id/mark-completed')
  complete(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.complete(+id, user);
  }
}
