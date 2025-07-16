import { z } from 'zod'

export type Volunteer = {
  id: string
  name: string
  surname: string
  dni: string
  email: string
  password: string
  availability: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'AMBOS'
  address?: string
  phone?: string
  country?: string
  subsidiary?: string
  education?: string
  courses?: string
  joiningDate: Date 
  programId: string
  birthDate: Date 
}

export const CreateVolunteerSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  dni: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  availability: z.enum(['TIEMPO_COMPLETO', 'MEDIO_TIEMPO', 'AMBOS']),
  address: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().min(1),
  subsidiary: z.string().min(1),
  education: z.string().optional(),
  courses: z.string().optional(),
  joiningDate: z.date(), 
  programId: z.string().min(1),
  birthDate:  z.date(), 
})

export type CreateVolunteerBody = z.infer<typeof CreateVolunteerSchema>
