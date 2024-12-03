import { atom } from 'recoil'

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(savedValue)
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, newValue)
    })
  }

const userTypeState = atom({
  key: 'userTypeState',
  default: 'owner',
  effects: [localStorageEffect('user_type_state')],
})

export { userTypeState }
