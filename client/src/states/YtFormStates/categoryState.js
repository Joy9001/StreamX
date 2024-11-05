import { atom } from 'recoil'

export const selectedCategoryState = atom({
  key: 'selectedCategoryState',
  default: null, // Initially no category is selected
})
