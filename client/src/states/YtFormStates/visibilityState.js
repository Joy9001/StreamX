import { atom } from 'recoil'

export const visibilityState = atom({
  key: 'visibilityState',
  default: 'public', // Default visibility option can be 'public'
})
