import { config } from "dotenv";
import * as process from "process";

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
  TINYFY_KEY: process.env.TINYFY_KEY,

  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_NAME: process.env.AWS_S3_NAME,
  AWS_S3_ACL: process.env.AWS_S3_ACL,
  AWS_S3_URL: process.env.AWS_S3_URL,
};
