'use client'

import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { onGetActivities } from '@/stores/actions/activities'
import { onCreateHour } from '@/stores/actions/hours'
import { getPageTitle } from '@/config'
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import NotificationBar from '@/components/NotificationBar'
import CardBox from '@/components/CardBox'
import FormField from '@/components/Form/Field'
import { Formik, Form, Field } from 'formik'

const NewHourPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const activities = useAppSelector((state) => state.activities.activities)

  useEffect(() => {
    dispatch(onGetActivities())
  }, [dispatch])

  const initialValues = {
    activityId: '',
    description: '',
    startDate: '',
    endDate: '',
  }

  const calculateHours = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return ''
    const start = new Date(startDateStr)
    const end = new Date(endDateStr)
    if (end <= start) return ''
    const diffMs = end.getTime() - start.getTime()
    const diffHrs = diffMs / (1000 * 60 * 60)
    return diffHrs.toFixed(2)
  }

  const handleSubmit = async (values: typeof initialValues) => {
    if (!values.activityId || !values.description || !values.startDate || !values.endDate) {
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
        activityId: values.activityId,
        description: values.description,
        startDate: Math.floor(start.getTime() / 1000),
        endDate: Math.floor(end.getTime() / 1000),
      }

      const result = await dispatch(onCreateHour(formattedValues))

      if (result.type === 'hours/create/fulfilled') {
        router.push('/hours')
      } else {
        setError('Error al registrar las horas')
      }
    } catch {
      setError('Hubo un error inesperado al registrar las horas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Registrar Horas')}</title>
      </Head>

      <SectionTitle first>Registrar Horas</SectionTitle>

      {error && <NotificationBar color="danger">{error}</NotificationBar>}

      <CardBox>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting, values }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/*<FormField label="Actividad" help="Seleccione la actividad asociada">
                  <Field name="activityId" as="select" className="w-full">
                    <option value="">-- Seleccionar Actividad --</option>
                    {activities.map((activity) => (
                      <option key={activity.id} value={activity.id}>
                        {activity.name}
                      </option>
                    ))}
                  </Field>
                </FormField>*/}

                <FormField label="Test" help="Test">
                  <Field
                    name="test"
                    as="textarea"
                    className="w-full"
                    placeholder="Test"
                    rows={3}
                  />
                </FormField>

                <FormField label="Fecha de Inicio" help="Seleccione la fecha y hora de inicio">
                  <Field name="startDate" type="datetime-local" className="w-full" />
                </FormField>

                <FormField label="Fecha de Fin" help="Seleccione la fecha y hora de fin">
                  <Field name="endDate" type="datetime-local" className="w-full" />
                </FormField>

                <FormField label="Horas" help="Cálculo automático de horas">
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-gray-100 cursor-not-allowed"
                    value={calculateHours(values.startDate, values.endDate)}
                  />
                </FormField>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Registrando...' : 'Registrar Horas'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}

export default NewHourPage
