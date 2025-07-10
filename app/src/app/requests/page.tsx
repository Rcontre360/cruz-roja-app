'use client'

import Head from 'next/head'
import {
  mdiDelete,
  mdiMonitorCellphone,
  mdiPencil,
  mdiPlus,
  mdiCheckCircle,
  mdiCloseCircle,
  mdiMinusCircle,
} from '@mdi/js'
import Icon from '@mdi/react'
import CardBox from '../../components/CardBox'
import NotificationBar from '../../components/NotificationBar'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import Table from '../../components/Table/Table'
import React, {useState} from 'react'
import {getPageTitle} from '../../config'
import {useAppDispatch, useAppSelector} from '../../stores/hooks'
import {onDeleteRequest, onGetRequests} from '../../stores/actions/requests'
import {useRouter} from 'next/navigation'
import {useDeleteConfirmation} from '../../components/DeleteConfirmationProvider'
import Button from '@/components/Button'
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronsUpDownIcon} from 'lucide-react'

const statusOptions = [
  {id: 'all', name: 'Todos'},
  {id: 'accepted', name: 'Aceptado'},
  {id: 'rejected', name: 'Rechazado'},
  {id: 'new', name: 'Nuevo'},
]

const RequestsPage = () => {
  const {loaded, error, requests} = useAppSelector((state) => state.requests)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {confirmDelete} = useDeleteConfirmation()

  const [statusFilter, setStatusFilter] = useState({id: 'all', name: 'Todos'}) // Filtro de estado

  const initState = async () => {
    await dispatch(onGetRequests())
  }

  const handleEdit = (row: {id: string}) => {
    router.push(`/requests/edit/${row.id}`)
  }

  const handleDelete = async (row: {id: string}) => {
    const confirmed = await confirmDelete(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar la solicitud de "${String(row.fullName)}"?`
    )

    if (confirmed) {
      await dispatch(onDeleteRequest({requestId: String(row.id)}))
    }
  }

  const handleCreate = () => {
    router.push('/requests/create/new') // Redirige a la página para crear una nueva solicitud
  }

  const renderStatus = (status?: string) => {
    let color = 'gray'
    let label = 'Nuevo'
    let icon = mdiMinusCircle // ícono predeterminado

    if (status === 'accepted') {
      color = 'green'
      label = 'Aceptado'
      icon = mdiCheckCircle // ícono para 'Aceptado'
    } else if (status === 'rejected') {
      color = 'red'
      label = 'Rechazado'
      icon = mdiCloseCircle // ícono para 'Rechazado'
    }

    return (
      <span style={{color, fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
        {/* Usamos el componente Icon de @mdi/react */}
        <Icon path={icon} size={1} style={{marginRight: '8px'}} />
        {label}
      </span>
    )
  }
  const formatDate = (dateInput?: Date | string | number) => {
    if (!dateInput) return '—'

    const date = new Date(dateInput)
    return isNaN(date.getTime()) ? '—' : date.toISOString().split('T')[0]
  }

  // Filtrar las solicitudes según el estado
  const filteredRequests = requests.filter((request) => {
    if (statusFilter.id === 'all') return true // Mostrar todas las solicitudes
    return request.status === statusFilter.id // Filtrar por estado
  })

  React.useEffect(() => {
    if (!loaded) initState()
  }, [loaded, initState])

  return (
    <>
      <Head>
        <title>{getPageTitle('Solicitudes de voluntariado')}</title>
      </Head>
      <SectionMain>
        <SectionTitle first>Listado solicitudes de voluntariado</SectionTitle>
        {error && (
          <NotificationBar color="danger" icon={mdiMonitorCellphone}>
            <>{error}</>
          </NotificationBar>
        )}
        {loaded && requests.length === 0 && (
          <NotificationBar color="info" icon={mdiMonitorCellphone}>
            Hay 0 solicitudes disponibles
          </NotificationBar>
        )}

        <div className="flex justify-between items-end mb-4">
          <div>
            <label className="mr-2 text-white">Filtrar por estado:</label>
            <Listbox
              value={statusFilter.id}
              onChange={(val) => setStatusFilter(statusOptions.find((op) => op.id === val))}
            >
              <div className="relative mt-1">
                <Listbox.Button className="border border-gray-300 relative w-48 cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                  <span className="block truncate">{statusFilter.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {statusOptions.map((option) => (
                      <Listbox.Option
                        key={option.id}
                        className={({active}) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                          }`
                        }
                        value={option.id}
                      >
                        {({selected}) => (
                          <>
                            <span
                              className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {option.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <Button
            label="Crear nueva solicitud"
            className="max-h-10"
            color="info"
            onClick={handleCreate}
          />
        </div>

        <CardBox className="mb-6" hasTable>
          <Table
            columns={[
              {key: 'country', label: 'País', type: 'text'},
              {key: 'subsidiary', label: 'Filial', type: 'text'},
              {key: 'programId', label: 'ID Programa', type: 'text'},
              {
                key: 'startDate',
                label: 'Fecha de inicio',
                type: 'custom',
                render: (row: {startDate: string}) => formatDate(row.startDate),
              }, // Formatear fecha de inicio
              {
                key: 'endDate',
                label: 'Fecha de fin',
                type: 'custom',
                render: (row: {endDate: string}) => formatDate(row.endDate),
              }, // Formatear fecha de fin
              {key: 'edit', label: 'Editar', icon: mdiPencil, onClick: handleEdit, type: 'icon'},
              {
                key: 'delete',
                label: 'Borrar',
                icon: mdiDelete,
                onClick: handleDelete,
                type: 'icon',
              },
              {
                key: 'status',
                label: 'Estado',
                type: 'custom',
                render: (row: {status: string}) => renderStatus(row.status),
              },
            ]}
            perPage={10}
            elements={filteredRequests} // Usamos las solicitudes filtradas
          />
        </CardBox>
      </SectionMain>
    </>
  )
}

export default RequestsPage
