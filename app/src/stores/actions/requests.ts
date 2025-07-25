import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../api'
import {CreateRequestBody, EditRequestBody, Request} from '../../schemas/requests'
import {handleAPIError} from './utils'

type RequestState = {
  requests: Request[] // Lista de todas las solicitudes
  request: Request | null // Solicitud específica, por ID
  loading: boolean
  loaded: boolean
  error: string
}

const INIT_REQUEST_STATE: RequestState = {
  requests: [],
  request: null, // Inicializamos en null
  loading: false,
  loaded: false,
  error: '',
}

// Acción para obtener todas las solicitudes
export const onGetRequests = createAsyncThunk('requests/all', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get<{requests: Request[]}>('/requests/all')
    return response.data
  } catch (error) {
    return handleAPIError(error, rejectWithValue)
  }
})

// Acción para eliminar una solicitud
export const onDeleteRequest = createAsyncThunk(
  'requests/delete',
  async ({requestId}: {requestId: string}, {rejectWithValue}) => {
    try {
      await api.delete(`/requests/remove/${requestId}`)
      return {requestId}
    } catch (error) {
      return handleAPIError(error, rejectWithValue)
    }
  }
)

// Acción para crear una solicitud
export const onCreateRequest = createAsyncThunk(
  'requests/create',
  async (newRequestData: CreateRequestBody, {rejectWithValue}) => {
    try {
      const response = await api.post<{request: Request}>('/requests/create', newRequestData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al crear la solicitud')
    }
  }
)

export const onEditRequest = createAsyncThunk(
  'requests/edit',
  async (args: {id: string; request: EditRequestBody}, {rejectWithValue}) => {
    try {
      const response = await api.put<{updated: Request}>(
        `/requests/edit/${args.id}`,
        args.request
      )
      return {id: args.id, request: response.data.updated}
    } catch (error: any) {
      console.error('Error al crear la solicitud:', error.response?.data || error.message)
      return rejectWithValue(error.response?.data || 'Error al crear la solicitud')
    }
  }
)

export const onApproveRejectRequest = createAsyncThunk(
  'requests/approve/reject',
  async (args: {id: string; status: 'approve' | 'reject'}, {rejectWithValue}) => {
    try {
      let res: any
      if (args.status === 'approve') res = await api.put<Request>(`/requests/approve/${args.id}`)
      else res = api.put<Request>(`/requests/reject/${args.id}`)
      return res.data.updated
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al crear la solicitud')
    }
  }
)

// Slice que maneja el estado de las solicitudes
const requestSlice = createSlice({
  name: 'requests',
  initialState: INIT_REQUEST_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener todas las solicitudes
      .addCase(onGetRequests.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(onGetRequests.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.requests = action.payload.requests
      })
      .addCase(onGetRequests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Crear una solicitud
      .addCase(onCreateRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload.request) // Añadir la nueva solicitud al estado
      })
      .addCase(onDeleteRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter((req) => req.id === action.payload.requestId)
      })
      // Editar una solicitud
      .addCase(onEditRequest.fulfilled, (state, action) => {
        state.requests = state.requests.map((req) =>
          req.id == action.payload.id ? action.payload.request : req
        )
      })
      // Editar una solicitud
      .addCase(onApproveRejectRequest.fulfilled, (state, action) => {
        state.requests = state.requests.map((req) =>
          req.id == action.payload ? action.payload : req
        )
      })
  },
})

export default requestSlice.reducer
