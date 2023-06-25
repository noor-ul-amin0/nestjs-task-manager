import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TodolistModule } from './todolist/todolist.module';
import { TasksModule } from './tasks/tasks.module';
import { ReportsModule } from './reports/reports.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TodolistModule,
    TasksModule,
    ReportsModule,
    MailModule,
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
