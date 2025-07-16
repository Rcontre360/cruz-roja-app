'use client'

import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { getPageTitle } from '@/config'
import { onUpdateHour, onGetHours } from '@/stores/actions/hours'
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import NotificationBar from '@/components/NotificationBar'
import CardBox from '@/components/CardBox'
import FormField from '@/components/Form/Field'
import { Formik, Form, Field } from 'formik'

const EditHourPage = () => {
  const router = useRouter()
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({
    activityId: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  const hours = useAppSelector((state) => state.hours.hours)
  const activities = useAppSelector((state) => state.activities.activities)

  /*useEffect(() => { //Para Usar API
    dispatch(onGetActivities())
    dispatch(onGetHours())
  }, [dispatch])

  useEffect(() => {
    const hour = hours.find((h) => h.id === id)
    if (hour) {
      setInitialValues({
        activityId: hour.activityId || '',
        description: (hour as any).description || '',
        startDate: new Date(Number(hour.startDate) * 1000).toISOString().slice(0, 16),
        endDate: new Date(Number(hour.endDate) * 1000).toISOString().slice(0, 16),
      })
      setLoading(false)
    }
  }, [hours, id])*/

useEffect(() => {
  // Simular respuesta del backend con mock data
  const mockHour = {
    id: '123',
    activityId: 'act1',
    description: 'Voluntariado en jornada médica',
    startDate: '2025-07-03T08:00',
    endDate: '2025-07-03T12:30',
  }

  setInitialValues(mockHour)
  setLoading(false) 
}, [])


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
    if (!values.activityId || !values.startDate || !values.endDate) {
      setError('Por favor, completa todos los campos obligatorios')
      return
    }

    const start = new Date(values.startDate)
    const end = new Date(values.endDate)

    if (start >= end) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin')
      return
    }

    try {
      setError('')
      const formatted = {
        id,
        activityId: values.activityId,
        description: values.description,
        startDate: Math.floor(start.getTime() / 1000),
        endDate: Math.floor(end.getTime() / 1000),
      }

      const result = await dispatch(onUpdateHour(formatted))
      if (result.type === 'hours/update/fulfilled') {
        router.push('/hours')
      } else {
        setError('Error al actualizar el registro')
      }
    } catch {
      setError('Hubo un error inesperado al actualizar')
    }
  }

  if (loading) return <p className="text-center">Cargando...</p>

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Editar Horas')}</title>
      </Head>

      <SectionTitle first>Editar Registro de Horas</SectionTitle>

      {error && <NotificationBar color="danger">{error}</NotificationBar>}

      <CardBox>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
          {({ values, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Actividad" help="Seleccione la actividad">
                  <Field name="activityId" as="select" className="w-full">
                    <option value="">-- Seleccionar Actividad --</option>
                    {activities.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.name}
                      </option>
                    ))}
                  </Field>
                </FormField>

                <FormField label="Descripción (opcional)">
                  <Field name="description" as="textarea" className="w-full" rows={3} />
                </FormField>

                <FormField label="Fecha de Inicio">
                  <Field name="startDate" type="datetime-local" className="w-full" />
                </FormField>

                <FormField label="Fecha de Fin">
                  <Field name="endDate" type="datetime-local" className="w-full" />
                </FormField>

                <FormField label="Horas calculadas">
                  <input
                    type="text"
                    readOnly
                    value={calculateHours(values.startDate, values.endDate)}
                    className="w-full bg-gray-100 cursor-not-allowed"
                  />
                </FormField>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Guardar Cambios
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}

export default EditHourPage
