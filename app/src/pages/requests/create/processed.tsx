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
import CardBox from '../../../components/CardBox'
import LayoutAuthenticated from '../../../layouts/Authenticated'
import NotificationBar from '../../../components/NotificationBar'
import SectionMain from '../../../components/Section/Main'
import SectionTitle from '../../../components/Section/Title'
import Table from '../../../components/Table/Table'
import React, {useState, useEffect} from 'react'
import {getPageTitle} from '../../../config'
import {useAppDispatch, useAppSelector} from '../../../stores/hooks'
import {onDeleteRequest, onGetRequests} from '../../../stores/actions/requests'
import {Request} from '../../../schemas/requests'
import {useRouter} from 'next/router'
import {useDeleteConfirmation} from '../../../components/DeleteConfirmationProvider'

const RequestsPage = () => {
  const {loading, loaded, error, requests} = useAppSelector((state) => state.requests)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {confirmDelete} = useDeleteConfirmation()

  const [statusFilter, setStatusFilter] = useState('all') // Filtro de estado

  // Función para inicializar los datos
  const initState = async () => {
    await dispatch(onGetRequests())
  }

  // Función para manejar edición
  const handleEdit = (row: Request) => {
    router.push(`/requests/edit/${row.id}`)
  }

  // Función para manejar eliminación
  const handleDelete = async (row: Request) => {
    const confirmed = await confirmDelete(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar la solicitud?`
    )

    if (confirmed) {
      const updatedRequests = requests.filter((request) => request.id !== row.id) // Filtra la solicitud eliminada
      dispatch(onDeleteRequest(updatedRequests)) // Despacha la acción de eliminar con los datos actualizados
    }
  }

  // Función para manejar la creación de nuevas solicitudes
  const handleCreate = () => {
    router.push('/requests/create/new')
  }

  // Función para renderizar el estado
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
        <Icon path={icon} size={1} style={{marginRight: '8px'}} />
        {label}
      </span>
    )
  }

  // Filtrar las solicitudes según el filtro seleccionado
  const filteredRequests = Array.isArray(requests)
    ? requests.filter((request) => {
      if (statusFilter === 'all') return true

      return request.status === statusFilter
    })
    : []

  // Función para cambiar el estado
  const toggleStatus = async (row: Request) => {
    const newStatus = row.status === 'accepted' ? 'rejected' : 'accepted'

    const confirmed = await confirmDelete(
      'Confirmar cambio de estado',
      `¿Estás seguro de que deseas cambiar el estado de la solicitud a "${newStatus === 'accepted' ? 'Aceptado' : 'Rechazado'}"?`
    )

    if (confirmed) {
      console.log(`Cambiando estado de ID ${row.id} a ${newStatus}`)
      // Aquí deberías hacer el dispatch para cambiar el estado en la base de datos o store
      // Por ejemplo: dispatch(onUpdateRequestStatus({ id: row.id, status: newStatus }))
    }
  }

  useEffect(() => {
    if (!loaded) initState()
  }, [loaded])

  return (
    <>
      <Head>
        <title>{getPageTitle('Solicitudes de voluntariado')}</title>
      </Head>
      <SectionMain>
        <SectionTitle first>Solicitudes procesadas</SectionTitle>
        {error && (
          <NotificationBar color="danger" icon={mdiMonitorCellphone}>
            {error}
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
            <option value="REJECTED">Aceptado</option>
            <option value="APPROVED">Rechazado</option>
          </select>
        </div>

        {/* Botón para crear una nueva solicitud */}
        <div className="mb-4">
          <button onClick={handleCreate} className="btn btn-primary flex items-center gap-2">
            <Icon path={mdiPlus} size={1} />
            Crear nueva solicitud
          </button>
        </div>

        <CardBox className="mb-6" hasTable>
          <Table
            columns={[
              {key: 'country', label: 'País', type: 'text'},
              {key: 'subsidiary', label: 'Filial', type: 'text'},
              {key: 'programId', label: 'ID Programa', type: 'text'},
              {key: 'startDate', label: 'Fecha de inicio', type: 'text'},
              {key: 'endDate', label: 'Fecha de fin', type: 'text'},
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
              {
                key: 'toggleStatus',
                label: 'Cambiar Estado',
                icon: mdiMinusCircle,
                onClick: toggleStatus,
                type: 'icon',
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

RequestsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default RequestsPage
