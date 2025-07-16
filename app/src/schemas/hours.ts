import { z } from 'zod'

export type Hour = {
  id: string
  activityId: string
  activity?: {
    id: string
    name: string
  }
  startDate: Date
  endDate: Date
}

export const CreateHourSchema = z.object({
  activityId: z.string(),
  startDate: z.date(), // fecha y hora de inicio
  endDate: z.date(),   // fecha y hora de fin
})

export type CreateHourBody = z.infer<typeof CreateHourSchema>
