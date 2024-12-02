import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  drawerOpen: false,
  drawerContent: {},
  navbarOpen: true,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload
    },
    setDrawerContent: (state, action) => {
      state.drawerContent = action.payload
    },
    setNavbarOpen: (state, action) => {
      state.navbarOpen = action.payload
    },
  },
})

export const { setDrawerOpen, setDrawerContent, setNavbarOpen } =
  uiSlice.actions

export default uiSlice.reducer
