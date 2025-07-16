import {configureStore} from '@reduxjs/toolkit'
import userSlice from './actions/users'
import programsSlice from './actions/programs'
import requestsReducer from './actions/requests'
import activitiesReducer from './actions/activities'
import hoursReducer from './actions/hours'
import volunteerSlice from './actions/volunteers'
import subsidiarySlice from './actions/subsidiaries'

export const store = configureStore({
  reducer: {
    requests: requestsReducer, // Reducer de solicitudes
    programs: programsSlice,
    activities: activitiesReducer,
    hours: hoursReducer,
    user: userSlice,
    volunteers: volunteerSlice,
    subsidiaries: subsidiarySlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
