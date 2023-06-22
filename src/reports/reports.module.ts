import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodoList } from 'src/todolist/todolist.model';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from 'src/tasks/tasks.model';

@Module({
  imports: [SequelizeModule.forFeature([TodoList, Task]), AuthModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
