import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { authenticate } from "@/middleware/auth";
import { db } from "@/db";

export const activitiesRouter: Router = (() => {
  const router = express.Router();

  // Obtener todas las actividades
  router.get("/all", authenticate, async (req: Request, res: Response) => {
    try {
      const activities = await db.activity.findMany();
      res.status(StatusCodes.OK).json({ activities });
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error retrieving activities",
        error: err.message,
      });
    }
  });

  // Crear nueva actividad
  router.post("/create", authenticate, async (req: Request, res: Response) => {
    try {
      const { name, description, camp, startDate, endDate } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(400).json({ message: "Usuario no autenticado" });
      }

      const activity = await db.activity.create({
        data: {
          name,
          description,
          camp,
          startDate: new Date(Number(startDate) * 1000),
          endDate: new Date(Number(endDate) * 1000),
          creatorId: userId,  // ← Aquí conectas la actividad al usuario creador
        },
      });

      res.status(StatusCodes.CREATED).json({ activity });
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error creating activity",
        error: err.message,
      });
    }
  });

  // Actualizar actividad
  router.put("/update/:id", authenticate, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { name, description, camp, startDate, endDate } = req.body;

      const activity = await db.activity.update({
        where: { id },
        data: {
          name,
          description,
          camp,
          startDate: new Date(Number(startDate) * 1000),
          endDate: new Date(Number(endDate) * 1000),
        },
      });

      res.status(StatusCodes.OK).json({ activity });
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error updating activity",
        error: err.message,
      });
    }
  });

  // Eliminar actividad
  router.delete("/remove/:id", authenticate, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await db.activity.delete({ where: { id } });
      res.status(StatusCodes.OK).json({ message: "Activity deleted successfully", id });
    } catch (err: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error deleting activity",
        error: err.message,
      });
    }
  });

  return router;
})();
