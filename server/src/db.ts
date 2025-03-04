import {PrismaClient} from "@prisma/client";

export const db = new PrismaClient();

const PROGRAMS = [
  {
    name: "Socorro",
    description: "Socorro",
  },
  {
    name: "Juventud",
    description: "Juventud",
  },
  {
    name: "Salud",
    description: "Salud",
  },
  {
    name: "Otro",
    description: "Otro",
  },
];

export const initDB = async () => {
  await db.$transaction(async (tx) => {
    for (const p of PROGRAMS) {
      const program = await tx.program.findUnique({
        where: {name: p.name},
      });

      if (!program) {
        await tx.program.create({
          data: {
            name: p.name,
            description: p.description,
          },
        });
      }
    }
  });
};
