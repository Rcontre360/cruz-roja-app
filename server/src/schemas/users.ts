import {z} from "zod";
import {Age, Email, Phone, UserRole} from "./misc";

export type UserRegistrationBody = z.infer<typeof UserRegistrationBodySchema>;
export const UserRegistrationBodySchema = z.object({
  email: Email,
  password: z.string(),
  name: z.string(),
  surname: z.string(),
  age: Age,
  country: z.string(),
  phone: Phone,
  address: z.string(),

  disponibility: z.string(),
  education: z.string(),
  courses: z.string(),
  ingressDate: z.number(),
  program: z.string(),
  subsidiary: z.string(),
  dni: z.string(),
});

export type UserLoginBody = z.infer<typeof UserLoginBodySchema>;
export const UserLoginBodySchema = z.object({
  email: Email,
  password: z.string(),
});

export type CurrentUser = z.infer<typeof CurrentUserSchema>;
export const CurrentUserSchema = z.object({
  email: Email,
  password: z.string(),
  name: z.string(),
  token: z.string(),
  role: UserRole,
});
