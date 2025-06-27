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
import LayoutAuthenticated from '../../layouts/Authenticated'
import NotificationBar from '../../components/NotificationBar'
import SectionMain from '../../components/Section/Main'
import SectionTitle from '../../components/Section/Title'
import Table from '../../components/Table/Table'
import React, {useState} from 'react'
import {getPageTitle} from '../../config'
import {useAppDispatch, useAppSelector} from '../../stores/hooks'
import {onDeleteRequest, onGetRequests} from '../../stores/actions/requests'
import {Request} from '../../schemas/requests'
import {useRouter} from 'next/router'
import {useDeleteConfirmation} from '../../components/DeleteConfirmationProvider'

const RequestsPage = () => {
  const {loading, loaded, error, requests} = useAppSelector((state) => state.requests)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {confirmDelete} = useDeleteConfirmation()

  const [statusFilter, setStatusFilter] = useState('all') // Filtro de estado

  const initState = async () => {
    await dispatch(onGetRequests())
  }

  const handleEdit = (row: Request) => {
    router.push(`/requests/edit/${row.id}`)
  }

  const handleDelete = async (row: Request) => {
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

  // Mock data de solicitudes
  const mockRequests: Request[] = [
    {
      id: 1,
      country: 'México',
      subsidiary: 'CDMX',
      programId: '101',
      startDate: '2025-05-01',
      endDate: '2025-05-30',
      status: 'accepted',
    },
    {
      id: 2,
      country: 'Colombia',
      subsidiary: 'Bogotá',
      programId: '102',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      status: 'rejected',
    },
    {
      id: 3,
      country: 'Argentina',
      subsidiary: 'Buenos Aires',
      programId: '103',
      startDate: '2025-07-01',
      endDate: '2025-07-30',
      status: 'new',
    },
  ]

  // Filtrar las solicitudes según el estado
  const filteredRequests = mockRequests.filter((request) => {
    if (statusFilter === 'all') return true // Mostrar todas las solicitudes
    return request.status === statusFilter // Filtrar por estado
  })

  React.useEffect(() => {
    if (!loaded) initState()
  }, [loaded])

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

        {/* Filtro de estado */}
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2">
            Filtrar por estado:
          </label>
          <select
            id="statusFilter"
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} // Cambiar filtro
          >
            <option value="all">Todos</option>
            <option value="accepted">Aceptado</option>
            <option value="rejected">Rechazado</option>
            <option value="new">Nuevo</option>
          </select>
        </div>

        {/* Botón para crear una nueva solicitud */}
        <div className="mb-4">
          <button onClick={handleCreate} className="btn btn-primary">
            {/* Icono correctamente insertado como SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d={mdiPlus} />
            </svg>
            Crear nueva solicitud
          </button>
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
                render: (row: Request) => formatDate(row.startDate),
              }, // Formatear fecha de inicio
              {
                key: 'endDate',
                label: 'Fecha de fin',
                type: 'custom',
                render: (row: Request) => formatDate(row.endDate),
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
                render: (row: Request) => renderStatus(row.status),
              },
            ]}
            perPage={10}
            elements={requests} // Usamos las solicitudes filtradas
          />
        </CardBox>
      </SectionMain>
    </>
  )
}

RequestsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default RequestsPage
