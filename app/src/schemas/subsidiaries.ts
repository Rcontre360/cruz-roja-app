import { z } from 'zod'

export const SubsidiaryRegisterBodySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
})


export type SubsidiaryRegisterBody = z.infer<typeof SubsidiaryRegisterBodySchema>

export const SubsidiarySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  creationDate: z.number(),
  createdById: z.string(),
})

export type Subsidiary = z.infer<typeof SubsidiarySchema>
