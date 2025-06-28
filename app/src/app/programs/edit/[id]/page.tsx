'use client'

import {Field, Form, Formik} from 'formik'
import Head from 'next/head'
import NotificationBar from '@/components/NotificationBar'
import Button from '@/components/Button'
import Buttons from '@/components/Buttons'
import CardBox from '@/components/CardBox'
import FormField from '@/components/Form/Field'
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import {getPageTitle} from '@/config'
import {useAppDispatch, useAppSelector} from '@/stores/hooks'
import {onEditProgram} from '@/stores/actions/programs'
import {useParams, useRouter} from 'next/navigation'

const EditProgramPage = () => {
  const {error} = useAppSelector((state) => state.programs)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const query = useParams()

  const handleSubmit = async (program: {description: string}) => {
    await dispatch(onEditProgram({programId: query.id.toString(), fields: program}))
    router.push('/programs')
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
                <Field type="text" name="description" placeholder="Descripcion" />
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

export default EditProgramPage
