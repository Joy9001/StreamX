import { atom } from 'recoil'

const allVidState = atom({
  key: 'allVidState',
  default: [],
})

const recentVidState = atom({
  key: 'recentVidState',
  default: [],
})

export { allVidState, recentVidState }
