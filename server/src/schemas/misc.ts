import z from "zod";
import validator from "validator";
import {ROLES} from "@/common/constants";

export const NumDate = z.number().refine(
  (timestamp) => {
    // Ensure it's a number
    if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
      return false;
    }

    // Unix timestamps in seconds should be between Jan 1, 1970, and a reasonable upper limit
    const minTimestamp = 1546540269; // Unix epoch start

    return timestamp >= minTimestamp;
  },
  {
    message: "Invalid date",
  }
);

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
