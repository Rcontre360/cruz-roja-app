import {z} from "zod";

export type CreateRequestBody = z.infer<typeof CreateRequestBodySchema>;
export const CreateRequestBodySchema = z.object({
  country: z.string(),
  subsidiary: z.string(),
  programId: z.number(),
});
