import { atom } from 'recoil'

export const recordingDateState = atom({
  key: 'recordingDateState',
  default: null, // Default is no date selected
})

export const locationState = atom({
  key: 'locationState',
  default: '', // Default is an empty string for location
})
