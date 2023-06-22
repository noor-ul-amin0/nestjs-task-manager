import {
  Column,
  Model,
  Table,
  DataType,
  BeforeUpdate,
  BeforeCreate,
  HasOne,
} from 'sequelize-typescript';
import { TodoList } from 'src/todolist/todolist.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    set(value: string) {
      this.setDataValue('email', value.toLowerCase());
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  facebookId: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isVerified: boolean;

  @Column(DataType.STRING)
  passwordResetToken: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;

  @HasOne(() => TodoList)
  todoList: TodoList[];

  @BeforeUpdate
  @BeforeCreate
  static addTimestampts(instance: User) {
    instance.createdAt = instance.updatedAt = new Date();
  }
}
