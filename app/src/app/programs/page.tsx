'use client'

import React from 'react'
import {mdiDelete, mdiMonitorCellphone, mdiPencil} from '@mdi/js'
import CardBox from '../../components/CardBox'
import NotificationBar from '../../components/NotificationBar'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import Table from '../../components/Table/Table'
import {getPageTitle} from '../../config'
import {useAppDispatch, useAppSelector} from '../../stores/hooks'
import {onDeleteProgram, onGetPrograms} from '../../stores/actions/programs'
import {Program} from '../../schemas/programs'
import {useRouter} from 'next/navigation'

const ProgramsPage = () => {
  const {loaded, error, programs} = useAppSelector((state) => state.programs)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const initState = async () => {
    await dispatch(onGetPrograms())
  }

  const handleEdit = (row: Program) => {
    router.push(`/programs/edit/${row.id}`)
  }

  const handleDelete = async (row: Program) => {
    await dispatch(onDeleteProgram({programId: String(row.id)}))
  }

  React.useEffect(() => {
    if (!loaded) initState()
  }, [loaded, initState])

  return (
    <>
      <SectionMain>
        <SectionTitle first>Listado programas de voluntariado</SectionTitle>
        {error && (
          <NotificationBar color="danger" icon={mdiMonitorCellphone}>
            {error}
          </NotificationBar>
        )}
        {loaded && programs.length == 0 && (
          <NotificationBar color="info" icon={mdiMonitorCellphone}>
            Hay 0 programas disponibles
          </NotificationBar>
        )}

        <CardBox className="mb-6" hasTable>
          <Table
            columns={[
              {key: 'id', label: 'ID', type: 'text'},
              {key: 'name', label: 'Nombre', type: 'text'},
              {key: 'description', label: 'Descripcion', type: 'text'},
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
            elements={programs}
          />
        </CardBox>
      </SectionMain>
    </>
  )
}

export default ProgramsPage
