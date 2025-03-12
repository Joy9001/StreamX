import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  owners: [],
  editors: [],
  ownersLoading: false,
  editorsLoading: false,
  ownersError: null,
  editorsError: null,
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setOwners: (state, action) => {
      state.owners = action.payload
    },
    setEditors: (state, action) => {
      state.editors = action.payload
    },
    setOwnersLoading: (state, action) => {
      state.ownersLoading = action.payload
    },
    setEditorsLoading: (state, action) => {
      state.editorsLoading = action.payload
    },
    setOwnersError: (state, action) => {
      state.ownersError = action.payload
    },
    setEditorsError: (state, action) => {
      state.editorsError = action.payload
    },
  },
})

export const {
  setOwners,
  setEditors,
  setOwnersLoading,
  setEditorsLoading,
  setOwnersError,
  setEditorsError,
} = adminSlice.actions

export default adminSlice.reducer
