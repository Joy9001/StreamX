import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allVideos: [],
  recentVideos: [],
  ytVideoUpload: {},
}

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setAllVideos: (state, action) => {
      state.allVideos = action.payload
    },
    setRecentVideos: (state, action) => {
      state.recentVideos = action.payload
    },
    setYtVideoUpload: (state, action) => {
      state.ytVideoUpload = action.payload
    },
  },
})

export const { setAllVideos, setRecentVideos, setYtVideoUpload } =
  videoSlice.actions

export default videoSlice.reducer
