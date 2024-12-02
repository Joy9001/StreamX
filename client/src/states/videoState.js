import { atom } from 'recoil'

const allVidState = atom({
  key: 'allVidState',
  default: [],
})

const recentVidState = atom({
  key: 'recentVidState',
  default: [],
})

const ytVideoUploadState = atom({
  key: 'ytVideoState',
  default: {},
})

export { allVidState, recentVidState, ytVideoUploadState }
