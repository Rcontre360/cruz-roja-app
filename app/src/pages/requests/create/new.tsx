import Head from 'next/head'
import {useState} from 'react'
import {useRouter} from 'next/router'
import {useAppDispatch} from '../../../stores/hooks'
import {onCreateRequest} from '../../../stores/actions/requests'
import {getPageTitle} from '../../../config'
import LayoutAuthenticated from '../../../layouts/Authenticated'
import SectionMain from '../../../components/Section/Main'
import SectionTitle from '../../../components/Section/Title'
import NotificationBar from '../../../components/NotificationBar'
import CardBox from '../../../components/CardBox'
import FormField from '../../../components/Form/Field' // Componente de campo para encapsular los inputs
import {Form, Field, Formik} from 'formik'

const NewRequestPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const initialValues = {
    country: '',
    subsidiary: '',
    programId: '',
    startDate: '',
    endDate: '',
  }

  const formatDateOnly = (date: Date) => {
    return date.toISOString().split('T')[0] // Esto saca solo el "2025-05-01"
  }

  const handleSubmit = async (values: typeof initialValues) => {
    if (
      !values.country ||
      !values.subsidiary ||
      !values.programId ||
      !values.startDate ||
      !values.endDate
    ) {
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

      const formattedValues = {
        country: values.country,
        subsidiary: values.subsidiary,
        programId: Number(values.programId),
        startDate: Math.floor(new Date(values.startDate).getTime() / 1000), // convertir a timestamp en segundos
        endDate: Math.floor(new Date(values.endDate).getTime() / 1000),
      }
      const actionResult = await dispatch(onCreateRequest(formattedValues))

      if (actionResult.type === 'requests/create/fulfilled') {
        router.push('/requests')
      }
    } catch (err) {
      setError('Hubo un error al crear la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Nueva Solicitud de Voluntariado')}</title>
      </Head>

      <SectionTitle first>Crear Solicitud de Voluntariado</SectionTitle>

      {error && <NotificationBar color="danger">{error}</NotificationBar>}

      <CardBox>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({isSubmitting}) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Campo País */}
                <FormField label="País" help="Por favor ingrese su país">
                  <Field name="country" type="text" className="w-full" placeholder="Ej: México" />
                </FormField>

                {/* Campo Filial */}
                <FormField label="Filial" help="Por favor ingrese la filial">
                  <Field
                    name="subsidiary"
                    type="text"
                    className="w-full"
                    placeholder="Ej: Caracas"
                  />
                </FormField>

                <FormField label="ID del Programa" help="Por favor ingrese el ID del programa">
                  <Field name="programId" type="number" className="w-full" placeholder="Ej: 1" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Campo Fecha de Inicio */}
                <FormField label="Fecha de Inicio" help="Por favor ingrese la fecha de inicio">
                  <Field name="startDate" type="date" className="w-full" />
                </FormField>

                {/* Campo Fecha de Fin */}
                <FormField label="Fecha de Fin" help="Por favor ingrese la fecha de fin">
                  <Field name="endDate" type="date" className="w-full" />
                </FormField>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Creando...' : 'Crear Solicitud'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}

NewRequestPage.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default NewRequestPage
