'use client'

import React, { useEffect } from 'react'
import { mdiDelete, mdiPencil, mdiClock } from '@mdi/js'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { useRouter } from 'next/navigation'
import {
  onGetHours,
  onDeleteHour,
} from '../../stores/actions/hours'
import SectionMain from '@/components/Section/Main'
import SectionTitle from '@/components/Section/Title'
import NotificationBar from '@/components/NotificationBar'
import Table from '@/components/Table/Table'
import CardBox from '@/components/CardBox'
import Button from '@/components/Button'
import { useDeleteConfirmation } from '@/components/DeleteConfirmationProvider'

const HoursPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { confirmDelete } = useDeleteConfirmation()

  const hoursState = useAppSelector((state) => state.hours)
  const { hours, error, loaded } = hoursState

  useEffect(() => {
    if (!loaded) dispatch(onGetHours())
  }, [loaded, dispatch])

  const handleCreate = () => {
    router.push('/hours/new')
  }

  const handleEdit = (row: { id: string }) => {
    router.push(`/hours/edit/${row.id}`)
  }

  const handleDelete = async (row: { id: string }) => {
    const confirm = await confirmDelete(
      'Eliminar registro de horas',
      '¿Seguro que deseas eliminar este registro?'
    )
    if (confirm) {
      await dispatch(onDeleteHour({ id: row.id }))
      dispatch(onGetHours())
    }
  }

  const calculateHours = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return ''
    const start = new Date(startDateStr)
    const end = new Date(endDateStr)
    if (end <= start) return ''
    const diffMs = end.getTime() - start.getTime()
    const diffHrs = diffMs / (1000 * 60 * 60)
    return diffHrs.toFixed(1)
  }
  const mockHours = [
  {
    id: '1',
    activity: { name: 'Jornada de Salud' },
    startDate: new Date('2025-07-01T08:00:00'),
    endDate: new Date('2025-07-01T12:00:00'),
    hours: 4.0,
  },
  {
    id: '2',
    activity: { name: 'Primeros Auxilios' },
    startDate: new Date('2025-07-02T09:30:00'),
    endDate: new Date('2025-07-02T11:00:00'),
    hours: 1.5,
  },
  {
    id: '3',
    activity: { name: 'Prevención' },
    startDate: new Date('2025-07-03T14:00:00'),
    endDate: new Date('2025-07-03T17:30:00'),
    hours: 3.5,
  },
]

  return (
    <SectionMain>
      <SectionTitle first>Gestión de Horas</SectionTitle>

      {error && (
        <NotificationBar color="danger" icon={mdiClock}>
          {error}
        </NotificationBar>
      )}

      <div className="flex justify-end mb-4">
        <Button label="Registrar nuevas horas" color="info" onClick={handleCreate} />
      </div>

      <CardBox hasTable>
        <Table
          columns={[
            {
              key: 'activity',
              label: 'Actividad Asociada',
              type: 'custom',
              render: (row: { activity?: { name?: string } }) => row.activity?.name ?? 'Sin actividad',
            },
            {
              key: 'hours',
              label: 'Horas',
              type: 'custom',
              render: (row: { startDate: string; endDate: string }) =>
                calculateHours(row.startDate, row.endDate)
            },
            {
              key: 'startDate',
              label: 'Fecha Inicio',
              type: 'custom',
              render: (row: { startDate: string }) => new Date(row.startDate).toISOString().slice(0, 10)
            },
            {
              key: 'endDate',
              label: 'Fecha Fin',
              type: 'custom',
              render: (row: { endDate: string }) => new Date(row.endDate).toISOString().slice(0, 10),
            },
            {
              key: 'action',
              label: 'Acción',
              type: 'custom',
              render: (row: { id: string }) => (
                <div className="flex gap-2">
                  <Button
                    icon={mdiPencil}
                    aria-label={`Editar horas`}
                    onClick={() => handleEdit(row)}
                  />
                  <Button
                    icon={mdiDelete}
                    aria-label={`Eliminar horas`}
                    onClick={() => handleDelete(row)}
                  />
                </div>
              ),
            },
          ]}
          perPage={10}
          elements={mockHours}
        />
      </CardBox>
    </SectionMain>
  )
}

export default HoursPage
