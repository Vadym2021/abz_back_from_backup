import { UploadedFile } from "express-fileupload";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Positions } from "./positions";

export interface PositionQueryResult {
  id: number;
  name: string;
}

export interface IPositionst {
  success: boolean;
  positions: {
    id: number;
    name: string;
  }[];
}

export interface ILink {
  next_url: string | null;
  prev_url: string | null;
}

export interface IResponse {
  success: boolean;
  page: number;
  total_pages: number;
  total_users: number;
  count: number;
  links: ILink;
  users: IUser[];
}

export interface IUser {
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  position_id: number;
  registration_timestamp?: number;
  userPhoto: string;
}

export interface IUserRequest extends IUser {
  position: string;
  registration_timestamp?: number;
}

export interface IUserCreate {
  userName: string;
  userEmail: string;
  userPhone: string;
  position_id: number;
  userPhoto: UploadedFile | UploadedFile[];
}

export interface IUserFake {
  userName: string;
  userEmail: string;
  userPhone: string;
  position_id: number;
  registration_timestamp: number;
  userPhoto: string;
}

@Entity("users")
export class User implements IUser {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column({})
  userEmail: string;

  @Column()
  userPhone: string;

  @ManyToOne(() => Positions, (position) => position.users)
  @JoinColumn({ name: "position_id" })
  position: Positions;

  @Column()
  position_id: number;

  @Column()
  registration_timestamp: number;

  @Column()
  userPhoto: string;
}
