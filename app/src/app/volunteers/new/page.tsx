'use client'

import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { onRegisterUser } from '@/stores/actions/users'
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
import { UserRegistrationBody } from '@/schemas/users'

countries.registerLocale(es)

const countryOptions = Object.entries(countries.getNames('es', { select: 'official' })).map(
  ([code, name]) => ({ code, name })
)

const availabilityOptions = [
  { value: 'TIEMPO_COMPLETO', label: 'Tiempo Completo' },
  { value: 'MEDIO_TIEMPO', label: 'Medio Tiempo' },
  { value: 'AMBOS', label: 'Ambos' },
]

export default function CreateVolunteerPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const programs = useAppSelector((s) => s.programs.programs)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (programs.length === 0) dispatch(onGetPrograms())
  }, [dispatch, programs.length])

  const initialValues = {
    name: '',
    surname: '',
    dni: '',
    email: '',
    password: '',
    repeatPassword: '',
    availability: '',
    address: '',
    education: '',
    courses: '',
    phone: '',
    joiningDate: '',
    programId: '',
    birthDate: '',
    country: '',
    subsidiary: '',
  }

  const handleSubmit = async (values: typeof initialValues) => {
    const required = ['name', 'surname', 'dni', 'email', 'password', 'availability', 'joiningDate', 'programId', 'birthDate', 'country', 'subsidiary']
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
    if (!passwordRegex.test(values.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo')
      return
    }

    const calcularEdad = (fechaNacimiento: string) => {
      const nacimiento = new Date(fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const mes = hoy.getMonth() - nacimiento.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
      }
      return edad
}

    try {
      setLoading(true)
      setError('')

      const user: UserRegistrationBody = {
        email: values.email,
        password: values.password,
        name: values.name,
        surname: values.surname,
        age: calcularEdad(values.birthDate),
        country: values.country,
        phone: values.phone,
        address: values.address,
        disponibility: values.availability,
        education: values.education,
        courses: values.courses,
        ingressDate: new Date(values.joiningDate).getTime() / 1000,
        program: values.programId,
        subsidiary: values.subsidiary,
        dni: values.dni,
      }

      await dispatch(onRegisterUser(user))
      router.push('/volunteers')
    } catch (e) {
      setError('Error al registrar voluntario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Registrar Voluntario')}</title>
      </Head>
      <SectionTitle first>Registrar Nuevo Voluntario</SectionTitle>
      {error && <NotificationBar color="danger">{error}</NotificationBar>}
      <CardBox>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                <FormField label="Contraseña *">
                  <Field name="password" type="password" className="w-full" />
                </FormField>
                <FormField label="Repetir Contraseña">
                  <Field name="repeatPassword" type="password" className="w-full" />
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
                  {loading ? 'Registrando...' : 'Registrar Voluntario'}
                </button>
              </div>

            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}
