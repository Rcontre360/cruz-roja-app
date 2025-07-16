'use client'

import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/stores/hooks'
import { onCreateActivity } from '@/stores/actions/activities' 
import { getPageTitle } from '@/config'
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import NotificationBar from '@/components/NotificationBar'
import CardBox from '@/components/CardBox'
import FormField from '@/components/Form/Field'
import { Formik, Form, Field } from 'formik'

const NewActivityPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const initialValues = {
    name: '',
    description: '',
    camp: '',
    startDate: '',
    endDate: '',
  }

  const handleSubmit = async (values: typeof initialValues) => {
    // Validaciones básicas
    if (!values.name || !values.description || !values.startDate || !values.endDate) {
      setError('Por favor, completa todos los campos')
      return
    }

    const start = new Date(values.startDate)
    const end = new Date(values.endDate)

    if (start >= end) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin')
      return
    }

    try {
      setLoading(true)
      setError('')

      const formattedValues = {
        name: values.name,
        description: values.description,
        startDate: Math.floor(start.getTime() / 1000),
        endDate: Math.floor(end.getTime() / 1000),
        camp: Number(values.camp)
      }

      const actionResult = await dispatch(onCreateActivity(formattedValues))

      if (actionResult.type === 'activities/create/fulfilled') {
        router.push('/activities') // Redirige al listado de actividades
      } else {
        setError('Error al crear la actividad')
      }
    } catch (err) {
      setError('Hubo un error inesperado al crear la actividad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Nueva Actividad')}</title>
      </Head>

      <SectionTitle first>Crear Nueva Actividad</SectionTitle>

      {error && <NotificationBar color="danger">{error}</NotificationBar>}

      <CardBox>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nombre" help="Ingrese el nombre de la actividad">
                  <Field
                    name="name"
                    type="text"
                    className="w-full"
                    placeholder="Ej:  Jornada de Salud"
                  />
                </FormField>

                <FormField label="Descripción" help="Ingrese una descripción breve">
                  <Field
                    name="description"
                    as="textarea"
                    className="w-full"
                    placeholder="Descripción de la actividad"
                    rows={3}
                  />
                </FormField>
                <FormField label="Campos Disponibles" help="Ingrese el número de campos disponibles">
                  <Field
                    name="camp"
                    as="textarea"
                    className="w-full"
                    placeholder="Ej: 5"
                    rows={3}
                  />
                </FormField>

                <FormField label="Fecha de Inicio" help="Seleccione la fecha de inicio">
                  <Field name="startDate" type="date" className="w-full" />
                </FormField>

                <FormField label="Fecha de Fin" help="Seleccione la fecha de fin">
                  <Field name="endDate" type="date" className="w-full" />
                </FormField>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Creando...' : 'Crear Actividad'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}

export default NewActivityPage
