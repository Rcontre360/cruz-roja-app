'use client'

import Head from 'next/head'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import NotificationBar from '@/components/NotificationBar'
import CardBox from '@/components/CardBox'
import FormField from '@/components/Form/Field'
import { Formik, Form, Field } from 'formik'

const mockSubsidiary = { id: '1', name: 'Miranda' }

const EditSubsidiaryPage = () => {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [error, setError] = useState('')
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  // Solo usamos el mock si el id coincide
  if (id !== mockSubsidiary.id) {
    return (
      <SectionMain>
        <NotificationBar color="danger">Filial no encontrada.</NotificationBar>
      </SectionMain>
    )
  }

  const handleSubmit = async (values: { name: string }) => {
    if (!values.name.trim()) {
      setError('Por favor, completa el nombre de la filial.')
      return
    }

    setLoadingSubmit(true)
    setError('')

    // Simula guardado y redirección
    setTimeout(() => {
      setLoadingSubmit(false)
      router.push('/subsidiaries')
    }, 1000)
  }

  return (
    <SectionMain>
      <Head>
        <title>Editar Filial</title>
      </Head>

      <SectionTitle first>Editar Filial</SectionTitle>

      {error && <NotificationBar color="danger">{error}</NotificationBar>}

      <CardBox>
        <Formik
          initialValues={{ name: mockSubsidiary.name }}
          onSubmit={handleSubmit}
        >
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
                  disabled={isSubmitting || loadingSubmit}
                >
                  {loadingSubmit ? 'Actualizando...' : 'Actualizar Filial'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}

export default EditSubsidiaryPage
