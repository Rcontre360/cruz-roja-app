import axios from 'axios';
import express, {Request, Response, Router} from 'express';
import {StatusCodes} from 'http-status-codes';

import {logger} from '@/server';
import {retryAction} from '@/common/misc';
import {env} from '@/common/env';
import {ServiceResponse} from '@/schemas/api';


export const usersRouter: Router = (() => {
  const router = express.Router();

  router.get('/book', async (req: Request, res: Response) => {
    logger.info(`VOB request`);

    const {data} = await retryAction(
      async () =>
        await axios<ServiceResponse<any>>({
          method: 'GET',
          url: `http://${env.HOST}:${env.ORDERBOOK_PORT}/book/fm`,
        }),
      3,
      1000
    );

    res.status(StatusCodes.OK).send(data.responseObject.books ?? {});
  });

  return router;
})();
