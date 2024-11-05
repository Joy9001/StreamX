import { atom } from 'recoil'

const loginState = atom({
  key: 'loginState',
  default: false,
})

const userState = atom({
  key: 'userState',
  default: 'owner',
})

export { loginState, userState }
