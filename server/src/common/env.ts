import dotenv from "dotenv";
dotenv.config({path: `${__dirname}/../../.env.${process.env.NODE_ENV}`});

import {cleanEnv, host, num, port, str, testOnly} from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({devDefault: testOnly("test"), choices: ["dev", "prod", "test"]}),
  HOST: host({devDefault: testOnly("localhost")}),

  SERVER_PORT: port({devDefault: testOnly(3000)}),
  CORS_ORIGIN: str({devDefault: testOnly("*")}),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({devDefault: 1000}),
  COMMON_RATE_LIMIT_WINDOW_MS: num({devDefault: 1000}),
  PINO_LOG_LEVEL: str({devDefault: "debug", default: "info"}),

  POSTGRES_ENDPOINT: str({devDefault: ""}),
  JWT_SECRET: str({devDefault: ""}),
  JWT_EXPIRATION: str({devDefault: "7d"}),
  PASSWORD_SALT: num({default: 10}),
});
