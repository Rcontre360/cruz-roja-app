import Head from 'next/head'
import {useState} from 'react'
import {useRouter} from 'next/router'
import {useAppDispatch, useAppSelector} from '../../../stores/hooks'
import {onEditRequest} from '../../../stores/actions/requests'
import {getPageTitle} from '../../../config'
import LayoutAuthenticated from '../../../layouts/Authenticated'
import SectionMain from '../../../components/Section/Main'
import SectionTitle from '../../../components/Section/Title'
import NotificationBar from '../../../components/NotificationBar'
import CardBox from '../../../components/CardBox'
import FormField from '../../../components/Form/Field' // Componente de campo para encapsular los inputs
import {Form, Field, Formik} from 'formik'

const EditRequestPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {id} = router.query // Obtener el ID de la solicitud desde la URL

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Obtener la solicitud que se va a editar
  const {requests, error: fetchError} = useAppSelector((state) => state.requests)
  const request = requests.find((req) => req.id === id)

  // Si la solicitud no está cargada aún, mostrar un mensaje de carga o error
  if (!request && fetchError) {
    return <NotificationBar color="danger">{fetchError}</NotificationBar>
  }

  const initialValues = {
    country: request?.country || '',
    subsidiary: request?.subsidiary || '',
    programId: request?.programId || '',
    startDate: request?.startDate
      ? new Date(request.startDate * 1000).toISOString().split('T')[0]
      : '',
    endDate: request?.endDate ? new Date(request.endDate * 1000).toISOString().split('T')[0] : '',
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
      setError('') // Limpiar cualquier mensaje de error previo

      const formattedValues = {
        country: values.country,
        subsidiary: values.subsidiary,
        programId: Number(values.programId),
        startDate: Math.floor(new Date(values.startDate).getTime() / 1000), // convertir a timestamp en segundos
        endDate: Math.floor(new Date(values.endDate).getTime() / 1000),
      }

      await dispatch(onEditRequest({id: id as string, request: formattedValues}))
      setSuccessMessage('Actualizacion exitosa')

      setTimeout(() => router.push('/requests'), 1000)
    } catch (err) {
      console.log('ERROR', err)
      setError('Hubo un error al editar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionMain>
      <Head>
        <title>{getPageTitle('Editar Solicitud de Voluntariado')}</title>
      </Head>

      <SectionTitle first>Editar Solicitud de Voluntariado</SectionTitle>

      {error && <NotificationBar color="danger">{error}</NotificationBar>}
      {successMessage && <NotificationBar color="success">{successMessage}</NotificationBar>}

      <CardBox>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({isSubmitting, isValid}) => (
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

                {/* Campo ID del Programa */}
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
                  className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${loading || !isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting || loading || !isValid}
                >
                  {loading ? 'Editando...' : 'Editar Solicitud'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionMain>
  )
}

EditRequestPage.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditRequestPage
