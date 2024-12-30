import express, {Request, Response, Router} from "express";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {logger} from "@/server";
import {env} from "@/common/env";
import {authenticate, authorize} from "@/middleware/auth";
import {ROLES} from "@/common/constants";
import {UserLoginBodySchema, UserRegistrationSchema} from "@/schemas/users";
import {handleServiceResponse} from "@/common/responses";
import {ResponseStatus, ServiceResponse} from "@/schemas/api";
import {db} from "@/db";

export const usersRouter: Router = (() => {
  const router = express.Router();

  router.get(
    "/admin",
    authenticate,
    authorize([ROLES.ADMIN]),
    async (req: Request, res: Response) => {
      logger.info(`User request`);

      res.status(StatusCodes.OK).send({
        user: (req as any).user,
      });
    }
  );

  router.get("/profile", authenticate, async (req: Request, res: Response) => {
    logger.info(`User request`);

    res.status(StatusCodes.OK).send({
      user: (req as any).user,
    });
  });

  router.post("/register", async (req, res) => {
    const {email, password, name, role} = req.body;

    const parse = UserRegistrationSchema.safeParse(req.body);
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

    try {
      const hashedPassword = await bcrypt.hash(password, env.PASSWORD_SALT);
      const user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role || ROLES.USER,
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
