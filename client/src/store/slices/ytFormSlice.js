import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  visibility: 'public',
  audience: 'notMadeForKids',
  license: 'standard',
  allowEmbedding: false,
  tags: [],
  recordingDate: null,
  location: '',
  selectedCategory: null,
}

export const ytFormSlice = createSlice({
  name: 'ytForm',
  initialState,
  reducers: {
    setVisibility: (state, action) => {
      state.visibility = action.payload
    },
    setAudience: (state, action) => {
      state.audience = action.payload
    },
    setLicense: (state, action) => {
      state.license = action.payload
    },
    setAllowEmbedding: (state, action) => {
      state.allowEmbedding = action.payload
    },
    setTags: (state, action) => {
      state.tags = action.payload
    },
    setRecordingDate: (state, action) => {
      state.recordingDate = action.payload
    },
    setLocation: (state, action) => {
      state.location = action.payload
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
  },
})

export const {
  setVisibility,
  setAudience,
  setLicense,
  setAllowEmbedding,
  setTags,
  setRecordingDate,
  setLocation,
  setSelectedCategory,
} = ytFormSlice.actions

export default ytFormSlice.reducer
