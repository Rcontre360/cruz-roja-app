'use client'

import React from 'react'
import Button from '../components/Button'
import CardBox from '../components/CardBox'
import SectionFullScreen from '../components/Section/FullScreen'
import {Field, Form, Formik} from 'formik'
import FormField from '../components/Form/Field'
import FormCheckRadio from '../components/Form/CheckRadio'
import Divider from '../components/Divider'
import Buttons from '../components/Buttons'
import NotificationBar from '../components/NotificationBar'
import {useRouter} from 'next/navigation'
import {useAppDispatch, useAppSelector} from '../stores/hooks'
import {onLoginUser} from '../stores/actions/users'
import {UserRegistrationBody} from '../schemas/users'

type LoginForm = {
  login: string
  password: string
  remember: boolean
}

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {user, token, error} = useAppSelector((state) => state.user)

  const handleSubmit = async (formValues: LoginForm) => {
    const user: UserRegistrationBody = {
      email: formValues.login,
      password: formValues.password,
    }
    await dispatch(onLoginUser(user))
  }

  const initialValues: LoginForm = {
    login: '',
    password: '',
    remember: false,
  }

  React.useEffect(() => {
    if (user?.email || token) router.push('/dashboard')
  }, [user, token, router])

  return (
    <SectionFullScreen bg="purplePink">
      <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl">
        {error && <NotificationBar color="danger">{error}</NotificationBar>}
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({isSubmitting}: {isSubmitting: boolean}) => (
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
                <Button type="submit" label="Login" color="info" disabled={isSubmitting} />
                <Button href="/register" label="Register" color="info" outline />
              </Buttons>
            </Form>
          )}
        </Formik>
      </CardBox>
    </SectionFullScreen>
  )
}

export default LoginPage
