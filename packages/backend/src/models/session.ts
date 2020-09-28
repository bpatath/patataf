import { DataTypes } from "sequelize";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
} from "sequelize-typescript";

export class SessionBase extends Model<SessionBase> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataTypes.STRING)
  id!: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  data!: string;

  @AllowNull(false)
  @Column(DataTypes.DATE)
  expires!: Date;
}

@Table
export default class Session extends SessionBase {}
