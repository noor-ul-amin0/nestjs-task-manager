import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from './tasks.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodoList } from 'src/todolist/todolist.model';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'upload/tasks',
        filename: (_, file, callback) => {
          const uniqueName = Math.random().toString(16);
          const extension = extname(file.originalname);
          callback(null, `${uniqueName}${extension}`);
        },
      }),
    }),
    SequelizeModule.forFeature([Task, TodoList]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
