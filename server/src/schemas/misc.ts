import z from 'zod';
import validator from 'validator';
import {ROLES} from '@/common/constants';

export const Email = z.string().refine((data) => validator.isEmail(data), {
  message: 'Invalid email',
});

export const UserRole = z.string().refine((data) => Object.values(ROLES).includes(data as any), {
  message: 'Invalid role',
});


