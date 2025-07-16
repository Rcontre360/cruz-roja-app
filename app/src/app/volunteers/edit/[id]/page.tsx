'use client'

import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { onUpdateVolunteer, onGetVolunteers } from '@/stores/actions/volunteers'
import { onGetPrograms } from '@/stores/actions/programs'
import { getPageTitle } from '@/config'
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import NotificationBar from '@/components/NotificationBar'
import CardBox from '@/components/CardBox'
import FormField from '@/components/Form/Field'
import { Formik, Form, Field } from 'formik'
import countries from 'i18n-iso-countries'
import es from 'i18n-iso-countries/langs/es.json'

countries.registerLocale(es)

const countryOptions = Object.entries(countries.getNames('es', { select: 'official' })).map(
  ([code, name]) => ({ code, name })
)

const availabilityOptions = [
  { value: 'TIEMPO_COMPLETO', label: 'Tiempo Completo' },
  { value: 'MEDIO_TIEMPO', label: 'Medio Tiempo' },
  { value: 'AMBOS', label: 'Ambos' },
]

// Mock data para cuando no hay voluntario cargado
const mockVolunteer = {
  id: 'mock-id',
  name: 'Juan',
  surname: 'Fernández',
  dni: '12345678',
  email: 'juan.fernandez@example.com',
  password: '',
  availability: 'TIEMPO_COMPLETO',
  address: 'Av. Este 2, La Candelaria',
  education: 'Licenciatura en Psicología',
  courses: 'Curso de Primeros Auxilios',
  phone: '+58 123 456 7890',
  joiningDate: '2023-01-01',
  programId: '',
  birthDate: '1990-01-01',
  country: 'Venezuela',
  subsidiary: 'Caracas',
}

export default function EditVolunteerPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const params = useParams()
  const { id } = params

  // Traer programas para el select
  const programs = useAppSelector((s) => s.programs.programs)

  // Traer voluntarios para buscar el que editamos
  const volunteers = useAppSelector((s) => s.volunteers.volunteers)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (volunteers.length === 0) dispatch(onGetVolunteers())
    if (programs.length === 0) dispatch(onGetPrograms())
  }, [dispatch, volunteers.length, programs.length])

  const volunteer = volunteers.find((v) => v.id === id) || mockVolunteer

  const initialValues = {
    name: volunteer.name || '',
    surname: volunteer.surname || '',
    dni: volunteer.dni || '',
    email: volunteer.email || '',
    password: '',
    repeatPassword: '',
    availability: volunteer.availability || '',
    address: volunteer.address || '',
    education: volunteer.education || '',
    courses: volunteer.courses || '',
    phone: volunteer.phone || '',
    joiningDate: volunteer.joiningDate
  ? new Date(volunteer.joiningDate).toISOString().split('T')[0]
  : '',
    programId: volunteer.programId || '',
    birthDate: volunteer.birthDate
  ? new Date(volunteer.birthDate).toISOString().split('T')[0]
  : '',
    country: volunteer.country || '',
    subsidiary: volunteer.subsidiary || '',
  }

  const handleSubmit = async (values: typeof initialValues) => {
    // Validaciones básicas
    const required = ['name','surname','dni','email','availability','joiningDate','programId','birthDate','country','subsidiary']
    for (const field of required) {
      if (!values[field as keyof typeof values]) {
        setError('Completa todos los campos obligatorios (*)')
        return
      }
    }
    if (values.password !== values.repeatPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    // Validación opcional de contraseña solo si hay cambio
    if (values.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
      if (!passwordRegex.test(values.password)) {
        setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo')
        return
      }
    }

    const availabilityMap: Record<string, "TIEMPO_COMPLETO" | "MEDIO_TIEMPO" | "AMBOS"> = {
      TIEMPO_COMPLETO: "TIEMPO_COMPLETO",
      MEDIO_TIEMPO: "MEDIO_TIEMPO",
      AMBOS: "AMBOS",
    }

    try {
      setLoading(true)
      setError('')
      await dispatch(onUpdateVolunteer({
        id,
        ...values,
        availability: availabilityMap[values.availability as keyof typeof availabilityMap],
        joiningDate: new Date(values.joiningDate),
        birthDate: new Date(values.birthDate),
      }))
      router.push('/volunteers')
    } catch (e) {
      setError('Error al actualizar voluntario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Editar Voluntario')}</title>
      </Head>
      <SectionTitle first>Editar Voluntario</SectionTitle>
      {error && <NotificationBar color="danger">{error}</NotificationBar>}
      <CardBox>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nombre *">
                  <Field name="name" type="text" className="w-full" />
                </FormField>

                <FormField label="Apellido *">
                  <Field name="surname" type="text" className="w-full" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="DNI *">
                  <Field name="dni" type="text" className="w-full" />
                </FormField>

                <FormField label="Correo *">
                  <Field name="email" type="email" className="w-full" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Contraseña (dejar vacío para no cambiar)">
                  <Field name="password" type="password" className="w-full" autoComplete="new-password" />
                </FormField>

                <FormField label="Repetir Contraseña">
                  <Field name="repeatPassword" type="password" className="w-full" autoComplete="new-password" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Disponibilidad *">
                  <Field name="availability" as="select" className="w-full">
                    <option value="">-- Seleccione --</option>
                    {availabilityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                </FormField>

                <FormField label="Dirección">
                  <Field name="address" type="text" className="w-full" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Estudios Académicos">
                  <Field name="education" as="textarea" rows={2} className="w-full" />
                </FormField>

                <FormField label="Cursos Especializados">
                  <Field name="courses" as="textarea" rows={2} className="w-full" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Teléfono">
                  <Field name="phone" type="text" className="w-full" />
                </FormField>

                <FormField label="Fecha de Nacimiento *">
                  <Field name="birthDate" type="date" className="w-full" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Fecha de Ingreso *">
                  <Field name="joiningDate" type="date" className="w-full" />
                </FormField>

                <FormField label="Programa de Voluntariado *">
                  <Field name="programId" as="select" className="w-full">
                    <option value="">-- Seleccione Programa --</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Field>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="País *">
                  <Field name="country" as="select" className="w-full">
                    <option value="">-- Seleccione país --</option>
                    {countryOptions.map(({ code, name }) => (
                      <option key={code} value={name}>{name}</option>
                    ))}
                  </Field>
                </FormField>

                <FormField label="Filial *">
                  <Field name="subsidiary" type="text" className="w-full" />
                </FormField>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Actualizando...' : 'Actualizar Voluntario'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}
