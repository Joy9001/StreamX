import { atom } from 'recoil'

const loginState = atom({
  key: 'loginState',
  default: false,
})

const userTypeState = atom({
  key: 'userTypeState',
  default: 'owner',
})

export { loginState, userTypeState }
