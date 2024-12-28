import {app, logger} from '@/server';
import {env} from './common/env';
import {createDbTables} from './db';

const server = app.listen(env.SERVER_PORT, async () => {
  const {NODE_ENV, HOST, SERVER_PORT} = env;

  await createDbTables();

  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${SERVER_PORT}`);
});

