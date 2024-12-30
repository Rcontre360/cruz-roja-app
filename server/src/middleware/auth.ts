import {env} from "@/common/env";
import {handleServiceResponse} from "@/common/responses";
import {db} from "@/db";
import {ResponseStatus, ServiceResponse} from "@/schemas/api";
import {CurrentUser} from "@/schemas/users";
import {Request, Response, NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import jwt from "jsonwebtoken";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return handleServiceResponse(
      new ServiceResponse(ResponseStatus.Failed, "No token provided", {}, StatusCodes.UNAUTHORIZED),
      res
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {id: string};

    const session = await db.session.findUnique({
      where: {token: token},
    });

    if (!session) throw new Error("session not found");
    if (Date.now() > session.expiresAt.getTime()) throw new Error("session expired");

    const user = await db.user.findUnique({
      where: {id: decoded.id},
    });

    delete (user as any)?.password;
    delete (user as any)?.createdAt;
    delete (user as any)?.updatedAt;

    (user as any).token = token;

    (req as any).user = user;
    next();
  } catch (err: any) {
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Failed,
        "Invalid token",
        {message: err.message},
        StatusCodes.UNAUTHORIZED
      ),
      res
    );
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!roles.includes(user.role)) {
      return res.status(403).json({error: "Forbidden"});
    }
    next();
  };
};
