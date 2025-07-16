
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'
import { Volunteer, CreateVolunteerBody } from '../../schemas/volunteers'
import { handleAPIError } from './utils'

type VolunteerState = {
  volunteers: Volunteer[]
  loading: boolean
  loaded: boolean
  error: string
}


const INIT_STATE: VolunteerState = {
  volunteers: [],
  loading: false,
  loaded: false,
  error: '',
}

// Acción para obtener todos los voluntarios
export const onGetVolunteers = createAsyncThunk<Volunteer[], void>(
  'volunteers/all',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<{ volunteers: Volunteer[] }>('/volunteers/all')
      return res.data.volunteers
    } catch (err) {
      return []
    }
  }
)

// Acción para crear un voluntario nuevo
export const onCreateVolunteer = createAsyncThunk(
  'volunteers/create',
  async (data: CreateVolunteerBody, { rejectWithValue }) => {
    try {
      const res = await api.post('/volunteers/create', data)
      return res.data
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)

// Acción para actualizar un voluntario existente
export const onUpdateVolunteer = createAsyncThunk(
  'volunteers/update',
  async (
    data: Volunteer, 
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/volunteers/update/${data.id}`, data)
      return res.data
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)

// Acción para eliminar un voluntario
export const onDeleteVolunteer = createAsyncThunk(
  'volunteers/delete',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await api.delete(`/volunteers/remove/${id}`)
      return { id }
    } catch (err) {
      return handleAPIError(err, rejectWithValue)
    }
  }
)

export const volunteersSlice = createSlice({
  name: 'volunteers',
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onGetVolunteers.pending, (state) => {
        state.loading = true
      })
      .addCase(onGetVolunteers.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.volunteers = action.payload ?? []
      })
      .addCase(onGetVolunteers.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(onCreateVolunteer.fulfilled, (state, action) => {
        state.volunteers.push(action.payload as Volunteer)
      })
      .addCase(onUpdateVolunteer.fulfilled, (state, action) => {
        const updatedVolunteer = action.payload as Volunteer
        const index = state.volunteers.findIndex((v) => v.id === updatedVolunteer.id)
        if (index !== -1) {
          state.volunteers[index] = updatedVolunteer
        }
      })
      .addCase(onDeleteVolunteer.fulfilled, (state, action) => {
        const id = (action.payload as { id: string }).id
        state.volunteers = state.volunteers.filter((v) => v.id !== id)
      })
  },
})

export default volunteersSlice.reducer
