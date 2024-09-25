import { atom } from 'recoil'

const navbarOpenState = atom({
  key: 'navbarOpenState',
  default: true,
})

export { navbarOpenState }
