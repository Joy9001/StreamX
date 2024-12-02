import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { userState } from '../../states/userState.js'

const AuthenticationWrapper = ({ children }) => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const [userData, setUserdata] = useRecoilState(userState)

  useEffect(() => {
    async function fetchUserData() {
      console.log('isAuthenticated:', isAuthenticated)
      console.log('userData:', userData)
      if (isAuthenticated && JSON.stringify(userData) === '{}') {
        console.log('Fetching user metadata...')
        try {
          const accessToken = await getAccessTokenSilently({
            cacheMode: 'on',
          })
          console.log('Access token:', accessToken)

          // Get and Create user data in backend
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth0/create`,
            { email: user.email },
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
            setUserdata(res.data.user)
          }
        } catch (error) {
          console.error(
            'Error fetching user data:',
            error.response?.data || error.message || 'Unknown error'
          )
        }
      }
    }

    fetchUserData()
  }, [isAuthenticated, userData, user, setUserdata, getAccessTokenSilently])

  return children
}

AuthenticationWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthenticationWrapper
