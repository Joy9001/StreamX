import { atom } from 'recoil'

const drawerState = atom({
  key: 'drawerState',
  default: false,
})

const drawerContentState = atom({
  key: 'drawerContentState',
  default: {},
})

export { drawerContentState, drawerState }
