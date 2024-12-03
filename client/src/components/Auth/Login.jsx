import axios from 'axios'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { loginState } from '../../states/loginState.js'
import { userTypeState } from '../../states/userTypeState.js'

function Login() {
  // State to manage input values
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setUserType = useRecoilState(userTypeState)[1]
  const [LoginState, setLoginState] = useRecoilState(loginState)
  // Handler for Google login
  const handleGoogleLogin = () => {
    console.log('Google login initiated. Preparing Google OAuth flow...')
    setUserType('owner')
    setLoginState(true)
    window.location.href = 'http://localhost:3000/auth/owner/google/callback'
  }

  // Handler for normal login form submission
  const handleLogin = (event) => {
    event.preventDefault()
    console.log(username)
    console.log(password)
    if (username && password) {
      console.log('Attempting login with email:', username)
      console.log('Login process initiated. Validating credentials...')
      // Add login logic here, such as API call for authentication
      axios
        .post('http://localhost:3000/jwt/login/owner', {
          username,
          password,
        })
        .then((user) => {
          console.log(user)
          document.cookie = `token=${user.data.token}; path=/; max-age=86400` // Cookie valid for 1 day (86400 seconds)
          setUserType('owner')
          setLoginState(true) // Set login state to true to enable navigation
          navigate('/storage')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log('Login failed. Email or password field is empty.')
    }
  }

  return (
    <div
      data-theme='pastel'
      className='flex min-h-screen items-center justify-center bg-base-200'>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='mb-6 text-center text-3xl font-bold text-primary-content'>
            Login As Owner
          </h2>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* div for Email input */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='Enter your email'
                className='input input-bordered w-full'
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                }} // onChange handler for email
                required
              />
            </div>

            {/* div for Passward input */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <input
                type='password'
                placeholder='Enter your password'
                className='input input-bordered w-full'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }} // onChange handler for password
                required
              />
            </div>

            {/* Login Button */}
            <div className='form-control mt-6'>
              <button type='submit' className='btn btn-primary w-full'>
                Login
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className='divider'>OR</div>

          {/* Google Login Button */}
          <button
            className='btn btn-outline w-full'
            onClick={handleGoogleLogin}>
            Login with Google
          </button>

          {/* Sign Up and Back Links */}
          <p className='mt-4 text-center'>
            Don&apos;t have an account?{' '}
            <NavLink to='/signup' className='link-hover link text-primary'>
              Sign Up
            </NavLink>
          </p>
          <p className='mt-4 text-center'>
            Login As{' '}
            <NavLink
              onClick={() => {
                navigate('/login/editor')
              }}
              className='link-hover link text-primary'>
              Editor
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
