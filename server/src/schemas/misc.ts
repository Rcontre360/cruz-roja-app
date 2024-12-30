import z from "zod";
import validator from "validator";
import {ROLES} from "@/common/constants";

export const Email = z.string().refine((data) => validator.isEmail(data), {
  message: "Invalid email",
});

export const Phone = z.string().refine((data) => validator.isMobilePhone(data), {
  message: "Invalid phone number",
});

export const Age = z.number().refine((data) => data >= 10 && data <= 100, {
  message: "Invalid age. Must be between 10 and 100",
});

export const UserRole = z.string().refine((data) => Object.values(ROLES).includes(data as any), {
  message: "Invalid role",
});
