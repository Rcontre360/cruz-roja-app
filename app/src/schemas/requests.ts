import {z} from 'zod'
import {NumDate} from './misc'

export type CreateRequestBody = z.infer<typeof CreateRequestBodySchema>
export const CreateRequestBodySchema = z.object({
  country: z.string(),
  subsidiary: z.string(),
  programId: z.number(),
  startDate: NumDate,
  endDate: NumDate,
})

export type EditRequestBody = z.infer<typeof EditRequestBodySchema>
export const EditRequestBodySchema = z.object({
  country: z.string().optional(),
  subsidiary: z.string().optional(),
  programId: z.number().optional(),
  startDate: z.number().optional(), // Unix timestamp
  endDate: z.number().optional(), // Unix timestamp
})
