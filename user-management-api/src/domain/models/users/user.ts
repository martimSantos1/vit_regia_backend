import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, AllowNull, ForeignKey, BelongsTo, Validate } from 'sequelize-typescript';
import { Role } from '../roles/role';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @AllowNull(false)
  @Validate({
    len: {
      args: [5, 25],
      msg: "O nome deve ter entre 5 e 25 caracteres."
    }
  })
  @Column(DataType.STRING)
  name!: string;

  @Unique
  @AllowNull(false)
  @Validate({
    isEmail: true
  })
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;
}
