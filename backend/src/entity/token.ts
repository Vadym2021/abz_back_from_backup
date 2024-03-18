import { Entity, PrimaryColumn } from "typeorm";

export interface IToken {
  success: boolean;
  token: string;
}

@Entity("token", { database: "tokens" })
export class Token {
  @PrimaryColumn()
  token: string;
}
