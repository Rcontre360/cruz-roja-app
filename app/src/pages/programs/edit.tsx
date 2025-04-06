import {Field, Form, Formik} from 'formik'
import Head from 'next/head'
import {ReactElement} from 'react'
import NotificationBar from '../../components/NotificationBar'
import Button from '../../components/Button'
import Buttons from '../../components/Buttons'
import CardBox from '../../components/CardBox'
import FormField from '../../components/Form/Field'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import {getPageTitle} from '../../config'
import {useAppDispatch, useAppSelector} from '../../stores/hooks'
import {onEditProgram} from '../../stores/actions/programs'
import {useRouter} from 'next/router'

const EditProgramPage = () => {
  const {error} = useAppSelector((state) => state.programs)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSubmit = async (program: {description: string}) => {
    await dispatch(onEditProgram({programId: router.query.id as string, fields: program}))
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit program')}</title>
      </Head>

      <SectionMain>
        <SectionTitle first>Editar programa</SectionTitle>
        {error && <NotificationBar color="danger">{error}</NotificationBar>}

        <CardBox>
          <Formik
            initialValues={{
              description: '',
            }}
            onSubmit={handleSubmit}
          >
            <Form>
              <FormField label="Descripcion">
                <Field type="text" name="descrciption" placeholder="Descripcion" />
              </FormField>
              <Buttons>
                <Button type="submit" color="info" label="Submit" />
              </Buttons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditProgramPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditProgramPage
