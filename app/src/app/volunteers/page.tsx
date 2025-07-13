'use client'

import React from 'react'
import {mdiDelete, mdiMonitorCellphone, mdiPencil} from '@mdi/js'
import CardBox from '../../components/CardBox'
import NotificationBar from '../../components/NotificationBar'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import Table from '../../components/Table/Table'
import {useAppDispatch, useAppSelector} from '../../stores/hooks'
import {onDeleteProgram, onGetPrograms} from '../../stores/actions/programs'
import {Program} from '../../schemas/programs'
import {useRouter} from 'next/navigation'
import {onDeleteVolunteer, onGetVolunteers} from '@/stores/actions/volunteers'

const VolunteerPage = () => {
  const {loaded, volunteers} = useAppSelector((state) => state.volunteers)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const initState = async () => {
    await dispatch(onGetVolunteers())
  }

  const handleEdit = (row: Program) => {
    router.push(`/programs/edit/${row.id}`)
  }

  const handleDelete = async (row: Program) => {
    await dispatch(onDeleteVolunteer({id: String(row.id)}))
  }

  React.useEffect(() => {
    if (!loaded) initState()
  }, [loaded, initState])

  return (
    <>
      <SectionMain>
        <SectionTitle first>Listado programas de voluntariado</SectionTitle>
        {loaded && volunteers.length == 0 && (
          <NotificationBar color="info" icon={mdiMonitorCellphone}>
            Hay 0 voluntarios
          </NotificationBar>
        )}

        <CardBox className="mb-6" hasTable>
          <Table
            columns={[
              {key: 'name', label: 'Nombre', type: 'text'},
              {key: 'surname', label: 'Apellido', type: 'text'},
              {key: 'dni', label: 'DNI', type: 'text'},
              {key: 'country', label: 'Pais', type: 'text'},
              {key: 'email', label: 'Correo', type: 'text'},
              {key: 'subsidiary', label: 'Filial', type: 'text'},
              {key: 'edit', label: 'Editar', icon: mdiPencil, onClick: handleEdit, type: 'icon'},
              {
                key: 'delete',
                label: 'Borrar',
                icon: mdiDelete,
                onClick: handleDelete,
                type: 'icon',
              },
            ]}
            perPage={10}
            elements={volunteers}
          />
        </CardBox>
      </SectionMain>
    </>
  )
}

export default VolunteerPage
