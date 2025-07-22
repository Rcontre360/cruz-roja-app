import { z } from 'zod'
export type Activity = {
  id: string
  name: string
  description: string
  camp: string
  startDate: Date // timestamp de inicio
  endDate: Date   // timestamp de fin
}

export const CreateActivitySchema = z.object({
  name: z.string(),
  description: z.string(),
  camp: z.string(),
  startDate: z.date(), // timestamp inicio
  endDate: z.date(),   // timestamp fin
})

export type CreateActivityBody = z.infer<typeof CreateActivitySchema>
