import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  const logout = () => {
    console.log('logout function called')

    // Call your backend to handle the Google logout
    axios
      .get('http://localhost:3000/auth/logout')
      .then((res) => {
        console.log(res.data)
        console.log('cookie', document.cookie)
        document.cookie =
          'connect.sid=; Max-Age=0; path=/; domain=http://localhost:5173'
        console.log('cookie', document.cookie)
        navigate('/') // Redirect to login page after successful logout
      })
      .catch((err) => {
        console.log(err)
        // navigate('/login') // Redirect even if there's an error
      })
  }

  return (
    <div
      data-theme='pastel'
      className='flex min-h-screen items-center justify-center bg-base-200'>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='mb-6 text-center text-3xl font-bold text-primary-content'>
            Log Out
          </h2>
          <button className='btn btn-outline w-full' onClick={logout}>
            Log Out
          </button>

          <NavLink
            to='/'
            onClick={() => navigate('/')}
            className='link-hover link mt-2 text-center'>
            Back to Home
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Logout
