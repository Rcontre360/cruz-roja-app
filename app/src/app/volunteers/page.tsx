'use client'

import Head from 'next/head'
import {
  mdiDelete,
  mdiPencil,
} from '@mdi/js'
import Icon from '@mdi/react'
import CardBox from '../../components/CardBox'
import NotificationBar from '../../components/NotificationBar'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import Table from '../../components/Table/Table'
import React, { useState, useEffect } from 'react'
import { getPageTitle } from '../../config'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import {
  onDeleteVolunteer,
  onGetVolunteers,
} from '../../stores/actions/volunteers' 
import { useRouter } from 'next/navigation'
import { useDeleteConfirmation } from '../../components/DeleteConfirmationProvider'
import Button from '@/components/Button'

const VolunteersPage = () => {
  const { loaded, error, volunteers: volunteersRaw } = useAppSelector((state) => state.volunteers)
  const volunteers = volunteersRaw.map((v) => ({
    ...v,
    name: v.name,
    surname: v.surname,
    dni: v.dni,
    country: v.country || 'N/A',
    email: v.email,
    subsidiary: v.subsidiary || 'N/A',
  }))

  const dispatch = useAppDispatch()
  const router = useRouter()
  const { confirmDelete } = useDeleteConfirmation()

  const initState = async () => {
    await dispatch(onGetVolunteers())
  }

  useEffect(() => {
    if (!loaded) initState()
  }, [loaded])

  const handleEdit = (row: { id: string }) => {
    router.push(`/volunteers/edit/${row.id}`)
  }

  const handleDelete = async (row: { id: string; name: string; surname: string }) => {
    const confirmed = await confirmDelete(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar al voluntario "${row.name} ${row.surname}"?`
    )
    if (confirmed) {
      await dispatch(onDeleteVolunteer({ id: row.id }))
      initState() // Recargar lista después de eliminar
    }
  }

  const handleCreate = () => {
    router.push('/volunteers/new') // Página para crear nuevo voluntario
  }

  const mockVolunteers = [
  {
    id: '1',
    name: 'Juan',
    surname: 'Pérez',
    dni: '12345678',
    country: 'Miranda',
    email: 'juan.perez@example.com',
    subsidiary: 'Caracas',
  },
  {
    id: '2',
    name: 'María',
    surname: 'Gómez',
    dni: '87654321',
    country: 'Caracas',
    email: 'maria.gomez@example.com',
    subsidiary: 'Bogotá',
  },
]
  return (
    <>
      <SectionMain>
        <Head>
          <title>{getPageTitle('Listado de Voluntarios')}</title>
        </Head>

        <SectionTitle first>Listado de Voluntarios</SectionTitle>

        {error && (
          <NotificationBar color="danger">
            <>{error}</>
          </NotificationBar>
        )}

        {loaded && volunteers.length === 0 && (
          <NotificationBar color="info">
            No hay voluntarios registrados
          </NotificationBar>
        )}

        <div className="flex justify-end mb-4">
          <Button
            label="Crear nuevo voluntario"
            color="info"
            onClick={handleCreate}
          />
        </div>

        <CardBox className="mb-6" hasTable>
          <Table
            columns={[
              { key: 'name', label: 'Nombre', type: 'text' },
              { key: 'surname', label: 'Apellido', type: 'text' },
              { key: 'dni', label: 'DNI', type: 'text' },
              { key: 'country', label: 'País', type: 'text' },
              { key: 'email', label: 'Correo', type: 'text' },
              { key: 'subsidiary', label: 'Filial', type: 'text' },
              {
                key: 'action',
                label: 'Acción',
                render: (row: any) => (
                  <div className="flex gap-3">
                    <Button
                      icon={mdiPencil}
                      onClick={() => handleEdit(row)}
                      aria-label={`Editar voluntario ${row.name}`}
                    />
                    <Button
                      icon={mdiDelete}
                      onClick={() => handleDelete(row)}
                      aria-label={`Eliminar voluntario ${row.name}`}
                    />
                  </div>
                ),
                type: 'custom',
              },
            ]}
            perPage={10}
            elements={mockVolunteers}
          />
        </CardBox>
      </SectionMain>
    </>
  )
}

export default VolunteersPage
