import cors from 'cors';
import express, {Express} from 'express';
import helmet from 'helmet';
import {pino} from 'pino';
import {healthCheckRouter} from './api/health/router';

import {usersRouter} from './api/users/router';
import {env} from './common/env';
import errorHandler from './middleware/error';
import requestLogger from './middleware/logger';

const serviceName = 'server';
const logger = pino({name: serviceName, level: env.PINO_LOG_LEVEL});
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({origin: env.CORS_ORIGIN, credentials: true}));
app.use(express.json());
app.use(helmet());
//app.use(rateLimiter);

// Request logging
app.use(requestLogger({name: serviceName}));

// Routes
app.use('/health', healthCheckRouter);
app.use('/users', usersRouter);

// Error handlers
app.use(errorHandler());

export {app, logger};
