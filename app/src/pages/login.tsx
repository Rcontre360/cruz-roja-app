import React from 'react'
import type {ReactElement} from 'react'
import Head from 'next/head'
import Button from '../components/Button'
import CardBox from '../components/CardBox'
import SectionFullScreen from '../components/Section/FullScreen'
import LayoutGuest from '../layouts/Guest'
import {Field, Form, Formik} from 'formik'
import FormField from '../components/Form/Field'
import FormCheckRadio from '../components/Form/CheckRadio'
import Divider from '../components/Divider'
import Buttons from '../components/Buttons'
import {useRouter} from 'next/router'
import {getPageTitle} from '../config'
import {useAppDispatch} from '../stores/hooks'
import {onRegisterUser} from '../stores/actions/users'
import {UserRegistrationBody} from '../schemas/users'

type LoginForm = {
  login: string
  password: string
  remember: boolean
}

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleSubmit = (formValues: LoginForm) => {
    const user: UserRegistrationBody = {
      email: formValues.login,
      password: formValues.password,
      name: 'rafael',
      surname: 'rafael',
      age: 23,
      country: 'venezuela',
      phone: '+584122936496',
      address: 'address',

      disponibility: 'address',
      education: 'ucv',
      courses: '',
      ingressDate: Date.now() / 1000, //seconds, not millisec
      program: '',
      subsidiary: '',
      dni: '30391915',
    }
    dispatch(onRegisterUser(user))
  }

  const initialValues: LoginForm = {
    login: 'john.doe',
    password: 'bG1sL9eQ1uD2sK3b',
    remember: true,
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>

      <SectionFullScreen bg="purplePink">
        <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <FormField label="Login" help="Please enter your login">
                <Field name="login" />
              </FormField>

              <FormField label="Password" help="Please enter your password">
                <Field name="password" type="password" />
              </FormField>

              <FormCheckRadio type="checkbox" label="Remember">
                <Field type="checkbox" name="remember" />
              </FormCheckRadio>

              <Divider />

              <Buttons>
                <Button type="submit" label="Login" color="info" />
                <Button href="/dashboard" label="Home" color="info" outline />
              </Buttons>
            </Form>
          </Formik>
        </CardBox>
      </SectionFullScreen>
    </>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>
}

export default LoginPage
