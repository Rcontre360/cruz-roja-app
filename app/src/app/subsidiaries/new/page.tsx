'use client'

import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/stores/hooks'
import { onCreateSubsidiary } from '@/stores/actions/subsidiaries'
import { getPageTitle } from '@/config'
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import NotificationBar from '@/components/NotificationBar'
import CardBox from '@/components/CardBox'
import FormField from '@/components/Form/Field'
import { Formik, Form, Field } from 'formik'

const NewSubsidiaryPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const initialValues = {
    name: '',
  }

  const handleSubmit = async (values: typeof initialValues) => {
    if (!values.name) {
      setError('Por favor, completa todos los campos.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const actionResult = await dispatch(onCreateSubsidiary(values))

      if (actionResult.type === 'subsidiaries/create/fulfilled') {
        router.push('/subsidiaries')
      } else {
        setError('Error al crear la filial.')
      }
    } catch (err) {
      setError('Hubo un error inesperado al crear la filial.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Nueva Filial')}</title>
      </Head>

      <SectionTitle first>Crear Nueva Filial</SectionTitle>

      {error && <NotificationBar color="danger">{error}</NotificationBar>}

      <CardBox>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>

            <div className="flex justify-center">
            <div className="w-full max-w-2xl">
                <FormField label="Nombre" help="Nombre de la filial">
                <Field
                    name="name"
                    type="text"
                    className="w-full"
                    placeholder="Ej: Caracas"
                />
                </FormField>
            </div>
            </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Creando...' : 'Crear Filial'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}

export default NewSubsidiaryPage
