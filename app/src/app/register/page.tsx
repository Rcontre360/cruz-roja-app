'use client'

import React from 'react'
import {getNames} from 'country-list'
import Head from 'next/head'
import Button from '@/components/Button'
import CardBox from '@/components/CardBox'
import SectionFullScreen from '@/components/Section/FullScreen'
import {Field, Form, Formik} from 'formik'
import FormField from '@/components/Form/Field'
import FormCheckRadio from '@/components/Form/CheckRadio'
import Divider from '@/components/Divider'
import Buttons from '@/components/Buttons'
import NotificationBar from '@/components/NotificationBar'
import {useRouter} from 'next/navigation'
import {getPageTitle} from '@/config'
import {useAppDispatch, useAppSelector} from '@/stores/hooks'
import {onRegisterUser} from '@/stores/actions/users'
import {UserRegistrationBody} from '@/schemas/users'
import {onGetPrograms} from '@/stores/actions/programs'

type LoginForm = {
  nombre: string
  apellido: string
  correo: string
  contraseña: string
  disponibilidad: string
  direccion: string
  estudios: string
  cursos: string
  telefono: string
  fechaIngreso: string
  programa: string
  edad: number
  pais: string
  filial: string
  ci: string
  remember: boolean
}

const countries: Record<string, string> = getNames()
const initialValues: LoginForm = {
  nombre: '',
  apellido: '',
  correo: '',
  contraseña: '',
  disponibilidad: '',
  direccion: '',
  estudios: '',
  cursos: '',
  telefono: '',
  fechaIngreso: '',
  programa: '',
  edad: 0,
  pais: '',
  filial: '',
  ci: '',
  remember: true,
}

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const programs = useAppSelector((state) => state.programs)
  const {error} = useAppSelector((state) => state.user)

  const handleSubmit = async (formValues: LoginForm) => {
    const user: UserRegistrationBody = {
      email: formValues.correo,
      password: formValues.contraseña,
      name: formValues.nombre,
      surname: formValues.apellido,
      age: formValues.edad,
      country: formValues.pais,
      phone: formValues.telefono,
      address: formValues.direccion,
      disponibility: formValues.disponibilidad,
      education: formValues.estudios,
      courses: formValues.cursos,
      ingressDate: new Date(formValues.fechaIngreso).getTime() / 1000, // Convert to seconds
      program: formValues.programa,
      subsidiary: formValues.filial,
      dni: formValues.ci,
    }
    await dispatch(onRegisterUser(user))
    router.push('/')
  }

  const goToLogin = () => {
    router.push('/')
  }

  React.useEffect(() => {
    try {
      if (!programs.loaded && !programs.loading && !programs.error) {
        dispatch(onGetPrograms())
      }
    } catch (err: any) {
      console.log('load programs err', err.message)
    }
  }, [programs, dispatch]) // Dependencies: re-run if `myState` or `dispatch` changes
  //

  return (
    <>
      <SectionFullScreen>
        <CardBox className="w-11/12 my-10 md:w-10/12 lg:w-9/12 xl:w-8/12 shadow-2xl">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({isSubmitting}: {isSubmitting: boolean}) => (
              <Form>
                {error && <NotificationBar color="danger">{error}</NotificationBar>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField label="Nombre" help="Por favor ingrese su nombre">
                    <Field name="nombre" className="w-full" />
                  </FormField>

                  <FormField label="Apellido" help="Por favor ingrese su apellido">
                    <Field name="apellido" className="w-full" />
                  </FormField>

                  <FormField label="Correo" help="Por favor ingrese su correo">
                    <Field name="correo" type="email" className="w-full" />
                  </FormField>

                  <FormField label="Contraseña" help="Por favor ingrese su contraseña">
                    <Field name="contraseña" type="password" className="w-full" />
                  </FormField>

                  <FormField label="Disponibilidad Horarios" help="Seleccione su disponibilidad">
                    <Field as="select" name="disponibilidad" className="w-full">
                      <option value="full_time">Tiempo completo</option>
                      <option value="part_time">Medio tiempo</option>
                      <option value="both">Ambos</option>
                    </Field>
                  </FormField>

                  <FormField label="Dirección" help="Por favor ingrese su dirección">
                    <Field name="direccion" className="w-full" />
                  </FormField>

                  <FormField label="Estudios Académicos" help="Por favor ingrese sus estudios">
                    <Field name="estudios" className="w-full" />
                  </FormField>

                  <FormField label="Cursos Especializados" help="Por favor ingrese sus cursos">
                    <Field name="cursos" className="w-full" />
                  </FormField>

                  <FormField label="Teléfono" help="Por favor ingrese su teléfono">
                    <Field name="telefono" type="tel" className="w-full" />
                  </FormField>

                  <FormField label="Fecha de Ingreso a la Cruz Roja" help="Seleccione la fecha">
                    <Field name="fechaIngreso" type="date" className="w-full" />
                  </FormField>

                  <FormField label="Programa de Voluntariado" help="Seleccione el programa">
                    <Field as="select" name="programa" className="w-full">
                      {programs.programs.map((p) => (
                        <option value={p.id} key={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </Field>
                  </FormField>

                  <FormField label="Edad" help="Por favor ingrese su edad">
                    <Field name="edad" type="number" className="w-full" />
                  </FormField>

                  <FormField label="País" help="Seleccione su país">
                    <Field as="select" name="pais" className="w-full">
                      {Object.entries(countries).map(([code, country]) => (
                        <option value={code} key={code}>
                          {country}
                        </option>
                      ))}
                    </Field>
                  </FormField>

                  <FormField label="Filial" help="Por favor ingrese su filial">
                    <Field name="filial" className="w-full" />
                  </FormField>

                  <FormField label="CI" help="Por favor ingrese su cédula de identidad">
                    <Field name="ci" className="w-full" />
                  </FormField>
                </div>

                <FormCheckRadio type="checkbox" label="Recordar">
                  <Field type="checkbox" name="remember" />
                </FormCheckRadio>

                <Divider />

                <div className="flex justify-between">
                  <Buttons>
                    <Button type="submit" label="Registrar" color="info" disabled={isSubmitting} />
                  </Buttons>
                  <Buttons>
                    <Button label="Cancelar" color="lightDark" onClick={goToLogin} />
                  </Buttons>
                </div>
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionFullScreen>
    </>
  )
}

export default LoginPage
