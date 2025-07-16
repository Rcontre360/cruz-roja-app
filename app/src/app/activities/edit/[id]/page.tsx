'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { getPageTitle } from '@/config'
import { onUpdateActivity } from '@/stores/actions/activities' 
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import NotificationBar from '@/components/NotificationBar'
import CardBox from '@/components/CardBox'
import FormField from '@/components/Form/Field'
import { Formik, Form, Field } from 'formik'
import Head from 'next/head'
import api from '@/stores/api'

const EditActivityPage = () => {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [activity, setActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

 /*useEffect(() => { //Para Usar API
    const fetchActivity = async () => {
      try {
        const res = await api.get<{ activity: any }>(`/activities/${id}`)
        setActivity(res.data.activity)
      } catch (err) {
        setError('Error al cargar la actividad')
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [id])*/

  useEffect(() => {
  // Simular respuesta del backend con mock data
  const fakeActivity = {
    name: 'Simulacro de Emergencia',
    description: 'Actividad para entrenar procedimientos de evacuación',
    camp: 3,
    startDate: Math.floor(new Date('2025-07-10').getTime() / 1000),
    endDate: Math.floor(new Date('2025-07-11').getTime() / 1000),
  }

  setActivity(fakeActivity)
  setLoading(false)
}, [])
  const handleSubmit = async (values: typeof activity) => {
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
      setSaving(true)
      setError('')

      await api.put(`/activities/update/${id}`, {
        ...values,
        camp: Number(values.camp),
        startDate: Math.floor(start.getTime() / 1000),
        endDate: Math.floor(end.getTime() / 1000),
      })

      router.push('/activities')
    } catch (err) {
      setError('Error al actualizar la actividad')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Cargando actividad...</div>

  if (!activity) return <div className="p-6">Actividad no encontrada</div>

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Editar Actividad')}</title>
      </Head>

      <SectionTitle first>Editar Actividad</SectionTitle>

      {error && <NotificationBar color="danger">{error}</NotificationBar>}

      <CardBox>
        <Formik
          initialValues={{
            name: activity.name,
            description: activity.description,
            camp: activity.camp,
            startDate: new Date(activity.startDate * 1000).toISOString().split('T')[0],
            endDate: new Date(activity.endDate * 1000).toISOString().split('T')[0],
          }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nombre">
                  <Field name="name" type="text" className="w-full" />
                </FormField>
                <FormField label="Descripción">
                  <Field name="description" as="textarea" className="w-full" rows={3} />
                </FormField>
                <FormField label="Campos Disponibles">
                  <Field name="camp" type="number" className="w-full" />
                </FormField>
                <FormField label="Fecha de Inicio">
                  <Field name="startDate" type="date" className="w-full" />
                </FormField>
                <FormField label="Fecha de Fin">
                  <Field name="endDate" type="date" className="w-full" />
                </FormField>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isSubmitting || saving}
                >
                  {saving ? 'Guardando...' : 'Actualizar Actividad'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}

export default EditActivityPage
