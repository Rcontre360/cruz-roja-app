import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/db';  // Asegúrate de que 'db' esté bien importado
import { CreateRequestBodySchema } from '../schemas/requests';  // Esquema de Zod
import { RequestStatus } from '@prisma/client';  // Asegúrate de que esté importado correctamente

const createRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      // Validar los datos recibidos en el cuerpo de la solicitud
      const validatedData = CreateRequestBodySchema.parse(req.body);

      // Crear una nueva solicitud en la base de datos usando Prisma
      const newRequest = await db.request.create({
        data: {
          country: validatedData.country,
          subsidiary: validatedData.subsidiary,
          programId: validatedData.programId,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          status: RequestStatus.WAITING,  // Estado predeterminado
          userId: req.body.userId,  // Debes asegurarte de que 'userId' esté presente en la solicitud
        },
      });

      // Responder con el objeto de la solicitud creada
      res.status(201).json(newRequest);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Error al crear la solicitud' });
    }
  } else {
    // Si el método no es POST, respondemos con un error 405 (Método no permitido)
    res.status(405).json({ error: 'Método no permitido' });
  }
};

export default createRequest;
