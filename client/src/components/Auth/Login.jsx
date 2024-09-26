import { useState } from 'react'
import { NavLink } from 'react-router-dom'
// import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  // State to manage input values
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  // Handler for Google login
  const handleGoogleLogin = () => {
    console.log('Google login initiated. Preparing Google OAuth flow...')
    window.location.href = 'http://localhost:5000/auth/google'
    // navigate('http://localhost:5000/auth/google/callback')
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
  }

  return (
    <div
      data-theme='pastel'
      className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='text-3xl font-bold text-center text-primary-content'>
            Login
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
                  className='label-text-alt link link-hover text-base'>
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
            Don't have an account?{' '}
            <NavLink
              to='/signup'
              onClick={handleSignUpRedirect}
              className='link link-hover text-primary'>
              Sign Up
            </NavLink>
          </p>
          <NavLink
            to='/'
            onClick={handleBackToHome}
            className='text-center mt-2 link link-hover'>
            Back to Home
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Login
