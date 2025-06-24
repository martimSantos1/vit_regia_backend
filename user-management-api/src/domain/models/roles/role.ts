import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, HasMany } from 'sequelize-typescript';
import { User } from '../users/user';

@Table({
  tableName: 'roles',
  timestamps: true,
})
export class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @HasMany(() => User)
  users!: User[];
}