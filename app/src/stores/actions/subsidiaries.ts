import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'
import { Subsidiary } from '../../schemas/subsidiaries'
import { handleAPIError } from './utils'

type SubsidiaryState = {
  subsidiaries: Subsidiary[]
  loadingList: boolean
  loadingCurrent: boolean
  loadingEdit: boolean
  loadingDelete: boolean
  loaded: boolean
  error: string | null
  currentSubsidiary?: Subsidiary | null
}

const INIT_SUBSIDIARY_STATE: SubsidiaryState = {
  subsidiaries: [],
  loadingList: false,
  loadingCurrent: false,
  loadingEdit: false,
  loadingDelete: false,
  loaded: false,
  error: null,
  currentSubsidiary: null,
}

// Obtener todas las filiales
export const onGetSubsidiaries = createAsyncThunk(
  'subsidiaries/all',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ subsidiaries: Subsidiary[] }>('/subsidiaries/all')
      return response.data
    } catch (error) {
      return handleAPIError(error, rejectWithValue)
    }
  }
)

// Obtener una filial por id
export const onGetSubsidiaryById = createAsyncThunk(
  'subsidiaries/getById',
  async (subsidiaryId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{ subsidiary: Subsidiary }>(`/subsidiaries/${subsidiaryId}`)
      return response.data.subsidiary
    } catch (error) {
      return handleAPIError(error, rejectWithValue)
    }
  }
)

// Editar filial
export const onEditSubsidiary = createAsyncThunk(
  'subsidiaries/edit',
  async (
    { subsidiaryId, fields }: { subsidiaryId: string; fields: Partial<Subsidiary> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<{ subsidiary: Subsidiary }>(
        `/subsidiaries/edit/${subsidiaryId}`,
        fields
      )
      return { subsidiaryId, subsidiary: response.data.subsidiary }
    } catch (error) {
      return handleAPIError(error, rejectWithValue)
    }
  }
)

// Eliminar filial
export const onDeleteSubsidiary = createAsyncThunk(
  'subsidiaries/delete',
  async ({ subsidiaryId }: { subsidiaryId: string }, { rejectWithValue }) => {
    try {
      await api.delete(`/subsidiaries/remove/${subsidiaryId}`)
      return { subsidiaryId }
    } catch (error) {
      return handleAPIError(error, rejectWithValue)
    }
  }
)

const subsidiarySlice = createSlice({
  name: 'subsidiaries',
  initialState: INIT_SUBSIDIARY_STATE,
  reducers: {
    clearCurrentSubsidiary(state) {
      state.currentSubsidiary = null
      state.error = null
      state.loadingCurrent = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(onGetSubsidiaries.pending, (state) => {
        state.loadingList = true
        state.error = null
      })
      .addCase(onGetSubsidiaries.fulfilled, (state, action) => {
        state.loadingList = false
        state.loaded = true
        if (action.payload) state.subsidiaries = action.payload.subsidiaries
      })
      .addCase(onGetSubsidiaries.rejected, (state, action) => {
        state.loadingList = false
        state.error = action.payload as string
      })

    builder
      .addCase(onGetSubsidiaryById.pending, (state) => {
        state.loadingCurrent = true
        state.error = null
        state.currentSubsidiary = null
      })
      .addCase(onGetSubsidiaryById.fulfilled, (state, action) => {
        state.loadingCurrent = false
        state.loaded = true
        if (action.payload) {
          state.currentSubsidiary = action.payload
        } else {
          state.currentSubsidiary = null
        }
      })
      .addCase(onGetSubsidiaryById.rejected, (state, action) => {
        state.loadingCurrent = false
        state.error = action.payload as string
        state.currentSubsidiary = null
      })

    builder
      .addCase(onEditSubsidiary.pending, (state) => {
        state.loadingEdit = true
        state.error = null
      })
      .addCase(onEditSubsidiary.fulfilled, (state, action) => {
        state.loadingEdit = false
        state.loaded = true
        if (action.payload) {
          const index = state.subsidiaries.findIndex(
            (s) => s.id === Number(action.payload.subsidiaryId)
          )
          if (index !== -1) state.subsidiaries[index] = action.payload.subsidiary

          if (state.currentSubsidiary?.id === action.payload.subsidiary.id) {
            state.currentSubsidiary = action.payload.subsidiary
          }
        }
      })
      .addCase(onEditSubsidiary.rejected, (state, action) => {
        state.loadingEdit = false
        state.error = action.payload as string
      })

    builder
      .addCase(onDeleteSubsidiary.pending, (state) => {
        state.loadingDelete = true
        state.error = null
      })
      .addCase(onDeleteSubsidiary.fulfilled, (state, action) => {
        state.loadingDelete = false
        state.loaded = true
        state.subsidiaries = state.subsidiaries.filter(
          (s) => s.id !== Number(action.payload?.subsidiaryId)
        )
        if (state.currentSubsidiary?.id === Number(action.payload?.subsidiaryId)) {
          state.currentSubsidiary = null
        }
      })
      .addCase(onDeleteSubsidiary.rejected, (state, action) => {
        state.loadingDelete = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentSubsidiary } = subsidiarySlice.actions

export default subsidiarySlice.reducer
