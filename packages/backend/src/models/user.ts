import { DataTypes } from "sequelize";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from "sequelize-typescript";

export class UserBase extends Model<UserBase> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  username!: string;

  @Column(DataTypes.STRING)
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
