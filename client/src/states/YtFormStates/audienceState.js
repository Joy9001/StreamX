import { atom } from 'recoil'

export const audienceState = atom({
  key: 'audienceState',
  default: 'notMadeForKids', // Default option set to 'No, it's not Made for Kids'
})
