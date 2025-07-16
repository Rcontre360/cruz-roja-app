'use client'

import Head from 'next/head'
import React, { useState, useEffect, useCallback } from 'react'
import { mdiDelete, mdiPencil, mdiPlus, mdiHome } from '@mdi/js'
import CardBox from '../../components/CardBox'
import NotificationBar from '../../components/NotificationBar'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import Table from '../../components/Table/Table'
import { getPageTitle } from '../../config'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { onDeleteSubsidiary, onGetSubsidiaries } from '../../stores/actions/subsidiaries'
import { Subsidiary } from '../../schemas/subsidiaries'
import { useRouter } from 'next/navigation'
import Button from '../../components/Button'

const SubsidiariesPage = () => {
  const { loaded, error, subsidiaries } = useAppSelector((state) => state.subsidiaries)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const initState = useCallback(async () => {
    await dispatch(onGetSubsidiaries())
  }, [dispatch])

  useEffect(() => {
    if (!loaded) initState()
  }, [loaded, initState])

  const handleEdit = (row: Subsidiary) => {
    router.push(`/subsidiaries/edit/${row.id}`)
  }

  const handleDelete = async (row: Subsidiary) => {
    if (window.confirm(`¿Eliminar la filial "${row.name}"? Esta acción es irreversible.`)) {
      await dispatch(onDeleteSubsidiary({ id: row.id }))
    }
  }

  const filteredSubsidiaries = subsidiaries.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const mockSubsidiaries: Subsidiary[] = [
  { id: 1, name: 'Caracas' },
  { id: 2, name: 'Miranda' },
  { id: 3, name: 'La Guaira' },
]
  return (
    <>
      <Head>
        <title>{getPageTitle('Filiales')}</title>
      </Head>
      <SectionMain>
        <SectionTitle first>
          Filiales
        </SectionTitle>

        {error && (
          <NotificationBar color="danger" icon={mdiHome}>
            {error}
          </NotificationBar>
        )}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Lista de Filiales</h2>
          <Button
            label="Nueva Filial"
            icon={mdiPlus}
            color="info"
            onClick={() => router.push('/subsidiaries/new')}
          />
        </div>

        <div className="mb-4">
          <input
            type="search"
            placeholder="Buscar filial..."
            className="border rounded px-3 py-2 w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar filial"
          />
        </div>

        <CardBox hasTable>
          <Table
            columns={[
              { key: 'id', label: 'ID', type: 'text' },
              { key: 'name', label: 'Nombre', type: 'text' },
              {
                            key: 'action',
                            label: 'Acción',
                            type: 'custom',
                            render: (row: { id: number; name: string }) => (
                              <div className="flex gap-2">
                                <Button
                                  icon={mdiPencil}
                                  aria-label={`Editar filial`}
                                  onClick={() => handleEdit(row)}
                                />
                                <Button
                                  icon={mdiDelete}
                                  aria-label={`Eliminar filial`}
                                  onClick={() => handleDelete(row)}
                                />
                              </div>
                            ),
                          },
            ]}
            elements={mockSubsidiaries}
            perPage={10}
          />
        </CardBox>
      </SectionMain>
    </>
  )
}

export default SubsidiariesPage
