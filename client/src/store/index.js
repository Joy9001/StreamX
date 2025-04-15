import { configureStore } from '@reduxjs/toolkit'
import adminReducer from './slices/adminSlice'
import uiReducer from './slices/uiSlice'
import userReducer from './slices/userSlice'
import videoReducer from './slices/videoSlice'
import ytFormReducer from './slices/ytFormSlice'
import requestReducer from './slices/requestSlice'

export const store = configureStore({
  reducer: {
    video: videoReducer,
    ui: uiReducer,
    user: userReducer,
    ytForm: ytFormReducer,
    admin: adminReducer,
    requests: requestReducer,
  },
})
