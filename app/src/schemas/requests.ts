import {z} from "zod";
import {NumDate} from "./misc";

export type CreateRequestBody = z.infer<typeof CreateRequestBodySchema>;
export const CreateRequestBodySchema = z.object({
  country: z.string(),
  subsidiary: z.string(),
  programId: z.number(),
  startDate: NumDate,
  endDate: NumDate,
});
