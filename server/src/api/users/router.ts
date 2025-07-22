import express, {Request, Response, Router} from "express";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {env} from "@/common/env";
import {authenticate, authorize} from "@/middleware/auth";
import {REQUEST_STATUS, ROLES} from "@/common/constants";
import {
  UserLoginBodySchema,
  UserModificationBodySchema,
  UserRegistrationBodySchema,
} from "@/schemas/users";
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

  router.get("/all", authenticate, async (req: Request, res: Response) => {
    const currentUserId = (req as any).user.id;

    try {
      const users = await db.user.findMany({
        where: {
          id: {
            not: currentUserId,
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          age: true,
          country: true,
          phone: true,
          address: true,
          disponibility: true,
          education: true,
          courses: true,
          ingressDate: true,
          program: true,
          subsidiary: true,
          dni: true,
          role: true,
          password: false,
        },
      });

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `users retrieved successfully`,
          {users},
          StatusCodes.OK
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          `error when retrieving users`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
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

  router.get("/modify/user", authenticate, async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
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

    if (values.password) values.password = await bcrypt.hash(values.password, env.PASSWORD_SALT);

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
  });

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

    const userReq = UserRegistrationBodySchema.parse(req.body);
    const {email, password, name} = userReq;

    try {
      const hashedPassword = await bcrypt.hash(password, env.PASSWORD_SALT);
      const user = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: ROLES.ADMIN,

          surname: userReq.surname,
          age: userReq.age,
          country: userReq.country,
          phone: userReq.phone,
          address: userReq.address,
          disponibility: userReq.disponibility,
          education: userReq.education,
          courses: userReq.courses,
          ingressDate: userReq.ingressDate,
          program: userReq.program,
          subsidiary: userReq.subsidiary,
          dni: userReq.dni,
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
          `error when registering user : ${err.message}`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  router.delete(
    "/delete/:userId",
    authenticate,
    authorize([ROLES.ADMIN]),
    async (req: Request, res: Response) => {
      const {userId} = req.params;

      // Validate userId parameter
      if (!userId) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            "User ID is required",
            {},
            StatusCodes.BAD_REQUEST
          ),
          res
        );
        return;
      }

      try {
        // Check if user exists
        const userToDelete = await db.user.findUnique({
          where: {id: userId},
        });

        if (!userToDelete) {
          handleServiceResponse(
            new ServiceResponse(ResponseStatus.Failed, "User not found", {}, StatusCodes.NOT_FOUND),
            res
          );
          return;
        }

        // Delete user's sessions first (to maintain referential integrity)
        await db.session.deleteMany({
          where: {userId},
        });

        // Delete the user
        await db.user.delete({
          where: {id: userId},
        });

        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Success,
            "User deleted successfully",
            {deletedUserId: userId},
            StatusCodes.OK
          ),
          res
        );
      } catch (err: any) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            "Error when deleting user",
            {message: err.message},
            StatusCodes.INTERNAL_SERVER_ERROR
          ),
          res
        );
      }
    }
  );

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

    delete user?.password;
    handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Success,
        `login succesfull`,
        {token, user},
        StatusCodes.ACCEPTED
      ),
      res
    );
  });
router.put("/modify/:userId", authenticate, authorize([ROLES.ADMIN]), async (req: Request, res: Response) => {
  const { userId } = req.params;
  const parse = UserModificationBodySchema.safeParse(req.body);

  if (!parse.success) {
    handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Failed,
        `Datos inválidos: ${parse.error.errors[0].path[0]}`,
        {},
        StatusCodes.BAD_REQUEST
      ),
      res
    );
    return;
  }

  const values = parse.data;

  if (values.password) {
    values.password = await bcrypt.hash(values.password, env.PASSWORD_SALT);
  }

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: values,
    });

    handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Success,
        `Usuario actualizado correctamente`,
        { user },
        StatusCodes.OK
      ),
      res
    );
  } catch (err: any) {
    handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Failed,
        `Error al actualizar usuario: ${err.message}`,
        { message: err.message },
        StatusCodes.INTERNAL_SERVER_ERROR
      ),
      res
    );
  }
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
