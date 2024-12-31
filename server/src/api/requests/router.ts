import express, {Request, Response, Router} from "express";
import {StatusCodes} from "http-status-codes";

import {authenticate, authorize} from "@/middleware/auth";
import {handleServiceResponse} from "@/common/responses";
import {ResponseStatus, ServiceResponse} from "@/schemas/api";
import {db} from "@/db";
import {REQUEST_STATUS, ROLES} from "@/common/constants";
import {CreateRequestBodySchema} from "@/schemas/requests";

export const requestsRouter: Router = (() => {
  const router = express.Router();

  router.get("/all", async (_: Request, res: Response) => {
    try {
      const requests = await db.request.findMany();

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `success`,
          {
            requests,
          },
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "Failed to fetch requests",
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  router.post("/create", authenticate, authorize([ROLES.USER, ROLES.ADMIN]), async (req, res) => {
    const parse = CreateRequestBodySchema.safeParse(req.body);
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

    const {country, subsidiary, programId, startDate, endDate} = CreateRequestBodySchema.parse(
      req.body
    );
    const userId = (req as any).user.id;

    try {
      const request = await db.request.create({
        data: {
          userId,
          country,
          subsidiary,
          programId,
          startDate: new Date(startDate * 1000),
          endDate: new Date(endDate * 1000),
        },
      });

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `request created succesfully`,
          {request},
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          `error when creating request`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  router.delete("/remove/:requestId", authenticate, authorize([ROLES.ADMIN]), async (req, res) => {
    const {requestId} = req.params;

    if (!requestId) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "request id must be defined",
          {},
          StatusCodes.BAD_REQUEST
        ),
        res
      );
      return;
    }

    try {
      await db.request.delete({
        where: {id: parseInt(requestId, 10)},
      });
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `request deleted succesfully`,
          {},
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          `error when deleting request`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  router.put("/approve/:requestId", authenticate, authorize([ROLES.ADMIN]), async (req, res) => {
    const {requestId} = req.params;

    if (!requestId) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "request id must be defined",
          {},
          StatusCodes.BAD_REQUEST
        ),
        res
      );
      return;
    }

    try {
      const updated = await db.request.update({
        where: {id: parseInt(requestId, 10)},
        data: {status: REQUEST_STATUS.APPROVED},
      });

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `request approved succesfully`,
          {updated},
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          `error when approving request`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  router.put("/reject/:requestId", authenticate, authorize([ROLES.ADMIN]), async (req, res) => {
    const {requestId} = req.params;

    if (!requestId) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "request id must be defined",
          {},
          StatusCodes.BAD_REQUEST
        ),
        res
      );
      return;
    }

    try {
      const updated = await db.request.update({
        where: {id: parseInt(requestId, 10)},
        data: {status: REQUEST_STATUS.REJECTED},
      });

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `request rejected succesfully`,
          {updated},
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          `error when rejecting request`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  return router;
})();
