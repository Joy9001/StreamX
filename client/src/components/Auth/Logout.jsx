import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  const logout = () => {
    console.log('logout function called')

    // Call your backend to handle the Google logout
    axios
      .post(
        'http://localhost:5000/auth/logout',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensure cookies are sent if necessary
        }
      )
      .then((res) => {
        console.log(res.data)
        navigate('/login') // Redirect to login page after successful logout
      })
      .catch((err) => {
        console.log(err)
        navigate('/login') // Redirect even if there's an error
      })
  }

  return (
    <>
      <div>Logout</div>
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default Logout
