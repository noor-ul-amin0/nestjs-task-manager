import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/users.model';
import { ITasksCount } from './reports.interfaces';
import { AuthGuard } from '@nestjs/passport';

@Controller('reports')
@UseGuards(AuthGuard())
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @Get('/task-counts')
  async getTaskCount(@GetUser() user: User): Promise<ITasksCount> {
    return this.reportsService.getTaskCount(user);
  }

  @Get('/avg-completed-per-day')
  getAvgTasksPerDay(@GetUser() user: User): Promise<number> {
    return this.reportsService.getAvgTasksPerDay(user);
  }

  @Get('/not-completed-on-time')
  getTasksNotCompletedOnTime(@GetUser() user: User): Promise<number> {
    return this.reportsService.getTasksNotCompletedOnTime(user);
  }

  @Get('/get-date-with-most-completed-tasks')
  getDateWithMostCompletedTasks(@GetUser() user: User): Promise<Date | null> {
    return this.reportsService.getDateWithMostCompletedTasks(user);
  }
}
