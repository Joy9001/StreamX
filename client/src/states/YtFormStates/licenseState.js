import { atom } from 'recoil'

export const licenseState = atom({
  key: 'licenseState',
  default: 'standard', // Default license option
})

export const allowEmbeddingState = atom({
  key: 'allowEmbeddingState',
  default: false, // Default for allowing embedding
})
