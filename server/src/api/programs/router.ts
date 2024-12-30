import express, {Request, Response, Router} from "express";
import {StatusCodes} from "http-status-codes";

import {authorize} from "@/middleware/auth";
import {handleServiceResponse} from "@/common/responses";
import {ResponseStatus, ServiceResponse} from "@/schemas/api";
import {db} from "@/db";
import {ProgramRegisterBodySchema} from "@/schemas/programs";

export const programsRouter: Router = (() => {
  const router = express.Router();

  router.get("/all", async (_: Request, res: Response) => {
    try {
      const programs = await db.program.findMany();

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `success`,
          {
            programs,
          },
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({error: "Failed to fetch programs"});
    }
  });

  router.post("/register", authorize(["ADMIN"]), async (req, res) => {
    const parse = ProgramRegisterBodySchema.safeParse(req.body);
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

    const createdById = (req as any).user.id; // Assuming `req.user` is set by authentication middleware
    const {name, description} = req.body;

    try {
      const program = await db.program.create({
        data: {
          name,
          description,
          createdById,
        },
      });

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `program created succesfully`,
          {program},
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          `error when creating program`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  router.delete("/remove/:programId", authorize(["ADMIN"]), async (req, res) => {
    const {programId} = req.params;

    if (!programId) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "program id must be defined",
          {},
          StatusCodes.BAD_REQUEST
        ),
        res
      );
      return;
    }

    try {
      await db.program.delete({
        where: {id: parseInt(programId, 10)},
      });
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `program deleted succesfully`,
          {},
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          `error when deleting program`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  router.put("/edit/:programId", authorize(["ADMIN"]), async (req, res) => {
    const {programId} = req.params;
    const {name, description} = req.body;

    try {
      const updated = await db.program.update({
        where: {id: parseInt(programId, 10)},
        data: {name, description},
      });

      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Success,
          `program updated succesfully`,
          {program: updated},
          StatusCodes.ACCEPTED
        ),
        res
      );
    } catch (err: any) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          `error when updating program`,
          {message: err.message},
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
        res
      );
    }
  });

  return router;
})();
