import axios from 'axios'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { loginState } from '../../states/loginState.js'
import { userTypeState } from '../../states/userTypeState.js'
function LoginEditor() {
  // State to manage input values
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setUserType = useRecoilState(userTypeState)[1]
  const [LoginState, setLoginState] = useRecoilState(loginState)

  // Handler for Google login
  const handleGoogleLogin = () => {
    console.log('Google login initiated. Preparing Google OAuth flow...')
    setUserType('editor')
    setLoginState(true)
    window.location.href = 'http://localhost:3000/auth/editor/google/callback'
  }

  // Handler for normal login form submission
  const handleLogin = (event) => {
    event.preventDefault()
    console.log(email)
    console.log(password)
    if (email && password) {
      console.log('Attempting login with email:', email)
      console.log('Login process initiated. Validating credentials...')
      // Add login logic here, such as API call for authentication
      axios
        .post('http://localhost:3000/jwt/login/editor', {
          email,
          password,
        })
        .then((user) => {
          console.log(user)
          document.cookie = `token=${user.data.token}; path=/; max-age=86400` // Cookie valid for 1 day (86400 seconds)
          setUserType('editor')
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
            Login As Editor
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
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
                navigate('/login/owner')
              }}
              className='link-hover link text-primary'>
              Owner
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginEditor
