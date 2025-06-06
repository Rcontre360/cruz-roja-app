import {mdiAccount, mdiBallotOutline, mdiGithub, mdiMail, mdiUpload} from '@mdi/js'
import {Field, Form, Formik} from 'formik'
import Head from 'next/head'
import {ReactElement} from 'react'
import Button from '../../components/Button'
import Buttons from '../../components/Buttons'
import Divider from '../../components/Divider'
import CardBox from '../../components/CardBox'
import FormCheckRadio from '../../components/Form/CheckRadio'
import FormCheckRadioGroup from '../../components/Form/CheckRadioGroup'
import FormField from '../../components/Form/Field'
import FormFilePicker from '../../components/Form/FilePicker'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import SectionTitleLineWithButton from '../../components/Section/TitleLineWithButton'
import {getPageTitle} from '../../config'

const FormsPage = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle('Forms')}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton icon={mdiBallotOutline} title="Formik forms example" main>
          <Button
            href="https://github.com/justboil/admin-one-react-tailwind"
            target="_blank"
            icon={mdiGithub}
            label="Star on GitHub"
            color="contrast"
            roundedFull
            small
          />
        </SectionTitleLineWithButton>

        <CardBox>
          <Formik
            initialValues={{
              fullname: 'John Doe',
              email: 'john.doe@example.com',
              phone: '',
              color: 'green',
              textarea: 'Hello',
            }}
            onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
          >
            <Form>
              <FormField label="Grouped with icons" icons={[mdiAccount, mdiMail]}>
                <Field name="fullname" placeholder="Full name" />
                <Field type="email" name="email" placeholder="Email" />
              </FormField>

              <FormField
                label="With help line and labelFor"
                labelFor="phone"
                help="Help line comes here"
              >
                <Field name="phone" placeholder="Phone" id="phone" />
              </FormField>

              <FormField label="Dropdown" labelFor="color">
                <Field name="color" id="color" component="select">
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                </Field>
              </FormField>

              <Divider />

              <FormField label="Textarea" hasTextareaHeight>
                <Field name="textarea" as="textarea" placeholder="Your text here" />
              </FormField>

              <Divider />

              <Buttons>
                <Button type="submit" color="info" label="Submit" />
                <Button type="reset" color="info" outline label="Reset" />
              </Buttons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>

      <SectionTitle>Custom elements</SectionTitle>

      <SectionMain>
        <CardBox>
          <Formik
            initialValues={{checkboxes: ['lorem'], switches: ['lorem'], radio: 'lorem'}}
            onSubmit={() => null}
          >
            <Form>
              <FormField label="Checkbox">
                <FormCheckRadioGroup>
                  <FormCheckRadio type="checkbox" label="Lorem">
                    <Field type="checkbox" name="checkboxes" value="lorem" />
                  </FormCheckRadio>
                  <FormCheckRadio type="checkbox" label="Ipsum">
                    <Field type="checkbox" name="checkboxes" value="ipsum" />
                  </FormCheckRadio>
                  <FormCheckRadio type="checkbox" label="Dolore">
                    <Field type="checkbox" name="checkboxes" value="dolore" />
                  </FormCheckRadio>
                </FormCheckRadioGroup>
              </FormField>

              <Divider />

              <FormField label="Radio">
                <FormCheckRadioGroup>
                  <FormCheckRadio type="radio" label="Lorem">
                    <Field type="radio" name="radio" value="lorem" />
                  </FormCheckRadio>
                  <FormCheckRadio type="radio" label="Ipsum">
                    <Field type="radio" name="radio" value="ipsum" />
                  </FormCheckRadio>
                </FormCheckRadioGroup>
              </FormField>

              <Divider />

              <FormField label="Switch">
                <FormCheckRadioGroup>
                  <FormCheckRadio type="switch" label="Lorem">
                    <Field type="checkbox" name="switches" value="lorem" />
                  </FormCheckRadio>
                  <FormCheckRadio type="switch" label="Ipsum">
                    <Field type="checkbox" name="switches" value="ipsum" />
                  </FormCheckRadio>
                </FormCheckRadioGroup>
              </FormField>
            </Form>
          </Formik>
          <Divider />
          <FormField>
            <FormFilePicker label="Upload" color="info" icon={mdiUpload} />
          </FormField>
        </CardBox>
      </SectionMain>
    </>
  )
}

FormsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default FormsPage
