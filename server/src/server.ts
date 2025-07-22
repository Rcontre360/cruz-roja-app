import cors from "cors";
import express, {Express} from "express";
import helmet from "helmet";
import {pino} from "pino";
import {adminRouter} from "./api/admin/router";
import {healthCheckRouter} from "./api/health/router";
import {programsRouter} from "./api/programs/router";
import {requestsRouter} from "./api/requests/router";

import {usersRouter} from "./api/users/router";
import {env} from "./common/env";
import errorHandler from "./middleware/error";
import requestLogger from "./middleware/logger";
import { activitiesRouter } from "./api/activities/router";


const serviceName = "server";
const logger = pino({name: serviceName, level: env.PINO_LOG_LEVEL});
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(cors({origin: env.CORS_ORIGIN, credentials: true}));
app.use(express.json());
app.use(helmet());
//app.use(rateLimiter);

// Request logging
app.use(requestLogger({name: serviceName}));

// Routes
const v1 = express.Router();
v1.use("/health", healthCheckRouter);
v1.use("/users", usersRouter);
v1.use("/admin", adminRouter);
v1.use("/programs", programsRouter);
v1.use("/requests", requestsRouter);
v1.use("/activities", activitiesRouter);

app.use("/v1", v1);

// Error handlers
app.use(errorHandler());

export {app, logger};
