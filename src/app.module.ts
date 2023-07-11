import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TodolistModule } from "./todolist/todolist.module";
import { TasksModule } from "./tasks/tasks.module";
import { ReportsModule } from "./reports/reports.module";
import { MailService } from "./mail/mail.service";
import { MailModule } from "./mail/mail.module";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { SequelizeModule } from "@nestjs/sequelize";
import { Dialect } from "sequelize";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
    }),
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
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
