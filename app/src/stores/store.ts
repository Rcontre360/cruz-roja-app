import {configureStore} from '@reduxjs/toolkit'
import userSlice from './actions/users'
import volunteerSlice from './actions/volunteers'
import programsSlice from './actions/programs'
import requestsReducer from './actions/requests' // Asegúrate de importar esto correctamente

export const store = configureStore({
  reducer: {
    requests: requestsReducer, // Reducer de solicitudes
    programs: programsSlice,
    user: userSlice,
    volunteers: volunteerSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
