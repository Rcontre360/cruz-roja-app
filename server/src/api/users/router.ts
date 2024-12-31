import express, {Request, Response, Router} from "express";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {env} from "@/common/env";
import {authenticate, authorize} from "@/middleware/auth";
import {REQUEST_STATUS, ROLES} from "@/common/constants";
import {UserLoginBodySchema, UserRegistrationBodySchema} from "@/schemas/users";
import {handleServiceResponse} from "@/common/responses";
import {ResponseStatus, ServiceResponse} from "@/schemas/api";
import {db} from "@/db";

export const usersRouter: Router = (() => {
  const router = express.Router();

  router.get("/profile", authenticate, async (req: Request, res: Response) => {
    handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Success,
        `success`,
        {
          user: (req as any).user,
        },
        StatusCodes.ACCEPTED
      ),
      res
    );
  });

  router.get("/hours", authenticate, async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const allRequests = await db.request.findMany({
      where: {userId, status: REQUEST_STATUS.APPROVED},
    });

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
  });

  router.get(
    "/admin/hours/:userId",
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

  router.post("/register", async (req, res) => {
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
  });

  router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const parse = UserLoginBodySchema.safeParse(req.body);
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

    const user = await db.user.findUnique({where: {email}});
    if (!user) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "Invalid email or password",
          {},
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "Invalid email or password",
          {},
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
      return;
    }

    const token = jwt.sign({id: user.id, role: user.role}, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRATION,
    });

    const daySecs = parseInt(env.JWT_EXPIRATION.slice(0, -1), 10) * 3600 * 24 * 1000;
    await db.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + daySecs),
      },
    });

    handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Success,
        `login succesfull`,
        {token},
        StatusCodes.ACCEPTED
      ),
      res
    );
  });

  router.post("/logout", authenticate, async (req, res) => {
    const token = (req as any)?.user?.token;
    if (!token) {
      return handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "No token provided",
          {},
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
    }

    await db.session.delete({where: {token}});

    handleServiceResponse(
      new ServiceResponse(ResponseStatus.Success, `logged out`, {}, StatusCodes.ACCEPTED),
      res
    );
  });

  return router;
})();
