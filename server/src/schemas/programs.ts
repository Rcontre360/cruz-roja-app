import {z} from "zod";

export type ProgramRegisterBody = z.infer<typeof ProgramRegisterBodySchema>;
export const ProgramRegisterBodySchema = z.object({
  description: z.string(),
  name: z.string(),
});
