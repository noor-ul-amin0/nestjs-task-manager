import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/auth/users.model';
import { Task } from 'src/tasks/tasks.model';
import { TodoList } from 'src/todolist/todolist.model';
import { SEQUELIZE } from './constants';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      sequelize.addModels([User, TodoList, Task]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
