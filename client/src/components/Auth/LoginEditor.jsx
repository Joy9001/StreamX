import axios from 'axios'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userTypeState } from '../../states/loginState.js'
function LoginEditor() {
  // State to manage input values
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setUserType = useRecoilState(userTypeState)[1]
  setUserType('editor')

  // Handler for Google login
  const handleGoogleLogin = () => {
    console.log('Google login initiated. Preparing Google OAuth flow...')
    window.location.href = 'http://localhost:3000/auth/editor/google/callback'
    // navigate('http://localhost:3000/auth/google/callback')
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
        .post('http://localhost:3000/jwt/login', {
          email,
          password,
        })
        .then((user) => {
          console.log(user)
          localStorage.setItem('token', user.data.token)
          navigate('/protected')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log('Login failed. Email or password field is empty.')
    }
  }

  // Handler for forgot password
  const handleForgotPassword = () => {
    console.log('Forgot password clicked. Redirecting to reset page...')
    // Logic to handle redirect or password reset initiation
  }

  // Handler for sign-up redirect
  const handleSignUpRedirect = () => {
    console.log('Sign-up link clicked. Navigating to sign-up page...')
  }

  // Handler for back to home
  const handleBackToHome = () => {
    console.log('Back to home clicked. Navigating to homepage...')
    navigate('/')
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

              <label className='label'>
                <NavLink
                  to='/sfdhbgbsd'
                  onClick={handleForgotPassword}
                  className='link-hover link label-text-alt text-base'>
                  Forgot password?
                </NavLink>
              </label>
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
            <NavLink
              to='/signup'
              onClick={handleSignUpRedirect}
              className='link-hover link text-primary'>
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
          <NavLink
            onClick={handleBackToHome}
            className='link-hover link mt-2 text-center'>
            Back to Home
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default LoginEditor
