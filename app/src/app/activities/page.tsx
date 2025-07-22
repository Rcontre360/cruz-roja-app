'use client'

import React, { useEffect } from 'react'
import { mdiDelete, mdiPencil, mdiCalendar } from '@mdi/js'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/navigation'
import {
  onGetActivities,
  onDeleteActivity,
} from '../../stores/actions/activities'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import NotificationBar from '../../components/NotificationBar'
import Table from '../../components/Table/Table'
import CardBox from '../../components/CardBox'
import Button from '@/components/Button'
import { useDeleteConfirmation } from '@/components/DeleteConfirmationProvider'

const ActivitiesPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { confirmDelete } = useDeleteConfirmation()

  const activitiesState = useAppSelector((state) => {
    //console.log('Redux state in ActivitiesPage:', state) // Para debug
    return state.activities
  })

  const { activities, error, loaded } = activitiesState

  useEffect(() => {
    if (!loaded) dispatch(onGetActivities())
  }, [loaded, dispatch])

  const handleCreate = () => {
    router.push('/activities/new')
  }

  const handleEdit = (row: { id: string }) => {
    router.push(`/activities/edit/${row.id}`)
  }

  const handleDelete = async (row: { id: string; name: string }) => {
    const confirm = await confirmDelete(
      'Eliminar actividad',
      `¿Seguro que deseas eliminar "${row.name}"?`
    )
    if (confirm) {
      await dispatch(onDeleteActivity({ id: row.id }))
      dispatch(onGetActivities())
    }
  }
/*const mockActivities = [
  {
    id: '1',
    name: 'Jornada de Salud',
    description: 'Atención médica gratuita',
    camp: '5',
    startDate: '2025-07-03T08:00:00Z',
    endDate: '2025-07-03T16:00:00Z',
  },
  {
    id: '2',
    name: 'Taller Ambiental',
    description: 'Educación sobre reciclaje',
    camp: '3',
    startDate: '2025-07-03T09:00:00Z',
    endDate: '2025-07-03T11:00:00Z',
  },
]*/

console.log(activities)
console.log('✅ Es array:', Array.isArray(activities));
  return (
    <SectionMain>
      <SectionTitle first>Gestión de actividades</SectionTitle>

      {error && (
        <NotificationBar color="danger" icon={mdiCalendar}>
          {error}
        </NotificationBar>
      )}

      <div className="flex justify-end mb-4">
        <Button label="Crear nueva actividad" color="info" onClick={handleCreate} />
      </div>

      <CardBox hasTable>
        <Table
          columns={[
            { key: 'name', label: 'Nombre', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'camp', label: 'Campos Disponibles', type: 'text' },
            {
              key: 'startDate',
              label: 'Fecha Inicio',
              render: (row: { startDate: string }) => new Date(row.startDate).toISOString().slice(0, 10),
              type: 'custom',
            },
            {
              key: 'endDate',
              label: 'Fecha Fin',
              render: (row: { endDate: string }) => new Date(row.endDate).toISOString().slice(0, 10),
              type: 'custom',
            },
            {
              key: 'action',
              label: 'Acción',
              type: 'custom',
              render: (row: { id: string; name: string }) => (
                <div className="flex gap-2">
                  <Button
                    icon={mdiPencil}
                    aria-label={`Editar ${row.name}`}
                    onClick={() => handleEdit(row)}
                  />
                  <Button
                    icon={mdiDelete}
                    aria-label={`Eliminar ${row.name}`}
                    onClick={() => handleDelete(row)}
                  />
                </div>
              ),
            },
          ]}
          perPage={10}
          elements={activities}
        />
      </CardBox>
    </SectionMain>
  )
}

export default ActivitiesPage
