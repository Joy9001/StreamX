import { setUserData } from '@/store/slices/userSlice'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const AuthenticationWrapper = ({ children }) => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } =
    useAuth0()
  const userData = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()
  const isEmpty = (obj) => Object.keys(obj).length === 0

  useEffect(() => {
    async function fetchUserData() {
      console.log('isAuthenticated:', isAuthenticated)
      console.log('userData:', userData)
      console.log('user:', user)
      if (isAuthenticated && isEmpty(userData)) {
        console.log('Fetching user metadata...')
        try {
          const accessToken = await getAccessTokenSilently()
          console.log('Access token:', accessToken)

          // Get and Create user data in backend
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth0/create`,
            { email: user.email, userId: user.sub },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            }
          )

          if (res.status === 200) {
            console.log('User fetched successfully:', res.data.user)
            dispatch(setUserData(res.data.user))
          }
        } catch (error) {
          console.error(
            'Error fetching user data:',
            error.response?.data || error.message || 'Unknown error'
          )
        }
      }
    }

    if (!isLoading) fetchUserData()
  }, [
    isAuthenticated,
    userData,
    user,
    dispatch,
    getAccessTokenSilently,
    isLoading,
  ])

  if (!isEmpty(userData)) {
    console.log('userData after fetchUserData', userData)
    return children
  }
}

AuthenticationWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthenticationWrapper
