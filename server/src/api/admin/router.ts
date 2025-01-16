import express, {Request, Response, Router} from "express";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcryptjs";
import {env} from "@/common/env";

import {authenticate, authorize} from "@/middleware/auth";
import {ROLES} from "@/common/constants";
import {handleServiceResponse} from "@/common/responses";
import {ResponseStatus, ServiceResponse} from "@/schemas/api";
import {db} from "@/db";
import {UserModificationBodySchema, UserRegistrationBodySchema} from "@/schemas/users";

export const adminRouter: Router = (() => {
  const router = express.Router();

  router.get(
    "/hours/:userId",
    authenticate,
    authorize([ROLES.ADMIN]),
    async (req: Request, res: Response) => {
      const {userId} = req.params;

      if (!userId) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            "userId must be defined",
            {},
            StatusCodes.BAD_REQUEST
          ),
          res
        );
        return;
      }

      const allRequests = await db.request.findMany({where: {userId}});

      const responseByProgram = allRequests.reduce(
        (acc, cur) => {
          const start = cur.startDate.getTime();
          const end = cur.endDate.getTime();

          return {
            ...acc,
            [cur.programId]: (end - start) / 1000 + (acc[cur.programId] || 0), //remove milliseconds
          };
        },
        {} as Record<string, number>
      );

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `success`,
          responseByProgram,
          StatusCodes.ACCEPTED
        ),
        res
      );
    }
  );

  router.get(
    "/create/user",
    authenticate,
    authorize([ROLES.ADMIN]),
    async (req: Request, res: Response) => {
      const parse = UserRegistrationBodySchema.safeParse(req.body);
      if (!parse.success) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            `wrong body: invalid field ${parse.error.errors[0].path[0]}`,
            {},
            StatusCodes.BAD_REQUEST
          ),
          res
        );
        return;
      }

      const {email, password, name} = req.body;

      try {
        const hashedPassword = await bcrypt.hash(password, env.PASSWORD_SALT);
        const user = await db.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: ROLES.ADMIN,
          },
        });

        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Success,
            `user created succesfully`,
            {user},
            StatusCodes.ACCEPTED
          ),
          res
        );
      } catch (err: any) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            `error when registering user`,
            {message: err.message},
            StatusCodes.INTERNAL_SERVER_ERROR
          ),
          res
        );
      }
    })

  router.get(
    "/modify/user/:userId",
    authenticate,
    authorize([ROLES.ADMIN]),
    async (req: Request, res: Response) => {
      const {userId} = req.params as {userId?: string};
      const parse = UserModificationBodySchema.safeParse(req.body);

      if (!parse.success) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            `wrong body: invalid field ${parse.error.errors[0].path[0]}`,
            {},
            StatusCodes.BAD_REQUEST
          ),
          res
        );
        return;
      }

      if (!userId) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            "user id is not defied",
            {},
            StatusCodes.BAD_REQUEST
          ),
          res
        );
        return;
      }

      const values = UserModificationBodySchema.parse(req.body);

      if (values.password)
        values.password = await bcrypt.hash(values.password, env.PASSWORD_SALT);

      try {
        const user = await db.user.update({
          where: {id: userId},
          data: values,
        });

        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Success,
            `user modified succesfully`,
            {user},
            StatusCodes.ACCEPTED
          ),
          res
        );
      } catch (err: any) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            `error when modifyig user`,
            {message: err.message},
            StatusCodes.INTERNAL_SERVER_ERROR
          ),
          res
        );
      }
    })

  router.get(
    "/delete/user/:userId",
    authenticate,
    authorize([ROLES.ADMIN]),
    async (req: Request, res: Response) => {
      const {userId} = req.params as {userId?: string};

      if (!userId) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            "user id is not defied",
            {},
            StatusCodes.BAD_REQUEST
          ),
          res
        );
        return;
      }

      try {
        await db.user.delete({
          where: {id: userId},
        });
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Success,
            `user deleted succesfully`,
            {},
            StatusCodes.ACCEPTED
          ),
          res
        );
      } catch (err: any) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            `error when deleting user`,
            {message: err.message},
            StatusCodes.INTERNAL_SERVER_ERROR
          ),
          res
        );
      }
    })

  return router;
})();
