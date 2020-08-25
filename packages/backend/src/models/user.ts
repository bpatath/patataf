import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";

export class UserBase extends Model<UserBase> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  username!: string;

  @Column(DataTypes.TEXT)
  password!: string | null;

  static async login(options: {
    username: string;
    password?: string;
    autocreate?: boolean;
  }): Promise<UserBase | null> {
    const username = options.username;
    const user = await this.findOne({ where: { username } });

    if (user) {
      return user;
    } else if (options.autocreate) {
      return await this.create({ username });
    }
    return null;
  }
}

@Table
export default class User extends UserBase {}
