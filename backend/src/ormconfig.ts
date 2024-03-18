import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  migrationsTableName: "migrations",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Burnwood_24",
  database: "postgres",
  logging: false,
  synchronize: false,
  name: "default",
  entities: ["ssrc/entity/**/*{.ts,.js}"],
  migrations: ["src/migration/**/*{.ts,.js}"],
  subscribers: [],
});
