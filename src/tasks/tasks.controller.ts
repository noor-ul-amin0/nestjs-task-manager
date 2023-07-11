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
  ParseIntPipe,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto, UpdateTaskDto } from "./dto/create-task.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../auth/users.model";
import { Task } from "./tasks.model";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

@ApiTags("tasks")
@ApiBearerAuth()
@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseInterceptors(FilesInterceptor("fileAttachments", 5))
  @Post()
  @ApiOperation({ summary: "Create a new task" })
  @ApiBody({ type: CreateTaskDto, description: "List of files" })
  @ApiResponse({
    status: 201,
    description: "Task created successfully",
    type: CreateTaskDto,
  })
  @ApiForbiddenResponse({ description: "Please add a Todo list first" })
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
  @ApiOperation({ summary: "Retrieve all tasks of a user" })
  @ApiResponse({
    status: 200,
    description: "Returned all tasks of a user",
    type: [CreateTaskDto],
  })
  @ApiForbiddenResponse({ description: "Please add a Todo list first" })
  findAll(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.findAll(user);
  }

  @Get("similar")
  @ApiOperation({ summary: "Retrieve similar tasks of a user" })
  @ApiResponse({
    status: 200,
    description: "Returned similar tasks of a user",
    type: [CreateTaskDto],
  })
  @ApiForbiddenResponse({ description: "Please add a Todo list first" })
  similar(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.similar(user);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a task" })
  @ApiResponse({
    status: 200,
    description: "Task updated successfully",
    type: CreateTaskDto,
  })
  @ApiForbiddenResponse({ description: "Please add a Todo list first" })
  @ApiNotFoundResponse()
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    if (files && files.length) {
      const filePaths = files.map((file) => file.path);
      updateTaskDto.fileAttachments = filePaths;
    }
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a task" })
  @ApiResponse({ status: 204, description: "Task deleted successfully" })
  @ApiForbiddenResponse({ description: "Please add a Todo list first" })
  @ApiNotFoundResponse()
  remove(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.remove(id, user);
  }

  @Put(":id/mark-completed")
  @ApiOperation({ summary: "Mark a task as completed" })
  @ApiResponse({
    status: 200,
    description: "Task marked as completed successfully",
    type: CreateTaskDto,
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse({ description: "Please add a Todo list first" })
  complete(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
    return this.tasksService.complete(id, user);
  }
}
