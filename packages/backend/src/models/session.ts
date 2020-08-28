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
  @Column
  id!: string;

  @AllowNull(false)
  @Column
  data!: string;

  @AllowNull(false)
  @Column
  expires!: Date;
}

@Table
export default class Session extends SessionBase {}
