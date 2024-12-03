import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  visibility: 'public',
  audience: 'notMadeForKids',
  license: 'youtube',
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
    resetYtForm: (state) => {
      state.visibility = 'public'
      state.audience = 'notMadeForKids'
      state.license = 'youtube'
      state.allowEmbedding = false
      state.tags = []
      state.recordingDate = null
      state.location = ''
      state.selectedCategory = null
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
  resetYtForm,
} = ytFormSlice.actions

export default ytFormSlice.reducer
