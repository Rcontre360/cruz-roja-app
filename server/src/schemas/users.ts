import { z } from "zod";
import { Email, UserRole } from "./misc";

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export const UserRegistrationSchema = z.object({
  email: Email,
  password: z.string(),
  name: z.string(),
  role: UserRole,
});

export type UserLoginBody = z.infer<typeof UserLoginBodySchema>;
export const UserLoginBodySchema = z.object({
  email: Email,
  password: z.string(),
});
