import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { User } from "./user";

export interface IPosition {
  positionId: number;
  positionName: string;
}

export interface IPositions {
  success: boolean;
  positions: IPosition[];
}

@Entity("positions")
export class Positions {
  @PrimaryColumn()
  positionId: number;

  @Column()
  positionName: string;

  @OneToMany(() => User, (user) => user.position)
  users: User[];
}
