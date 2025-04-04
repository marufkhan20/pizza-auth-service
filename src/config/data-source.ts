import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: Number(Config.DB_PORT),
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  // don't use this in production
  synchronize: Config.NODE_ENV === "dev" || Config.NODE_ENV === "test",
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
