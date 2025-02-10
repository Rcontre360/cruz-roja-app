import {z} from 'zod'

export type ProgramRegisterBody = z.infer<typeof ProgramRegisterBodySchema>
export const ProgramRegisterBodySchema = z.object({
  description: z.string(),
  name: z.string(),
})

export type Program = z.infer<typeof ProgramSchema>
export const ProgramSchema = z.object({
  name: z.string(),
  id: z.number(),
  description: z.string(),
  creationDate: z.number(),
  createdById: z.string(),
})
