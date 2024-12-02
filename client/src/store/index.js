import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/uiSlice'
import userReducer from './slices/userSlice'
import videoReducer from './slices/videoSlice'
import ytFormReducer from './slices/ytFormSlice'

export const store = configureStore({
  reducer: {
    video: videoReducer,
    ui: uiReducer,
    user: userReducer,
    ytForm: ytFormReducer,
  },
})
