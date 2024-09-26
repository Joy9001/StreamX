import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function SignUp() {
  // State to manage input values
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Handler for Google sign-up
  const handleGoogleSignUp = () => {
    console.log('Google sign-up initiated. Preparing Google OAuth flow...')
    window.open('http://localhost:5000/auth/google/callback', '_self')
  }

  // Handler for sign-up form submission
  const handleSignUp = (event) => {
    event.preventDefault()
    console.log(name, email, password, confirmPassword)
    if (password !== confirmPassword) {
      console.log('Sign-up failed. Passwords do not match.')
      return
    }
    if (name && email && password) {
      console.log('Attempting sign-up with name:', name, ', email:', email)
      console.log('Sign-up process initiated. Validating inputs...')
      // Add sign-up logic here, such as API call for registration
    } else {
      console.log('Sign-up failed. One or more fields are empty.')
    }
  }

  // Handler for login link click
  const handleLoginRedirect = () => {
    console.log('Login link clicked. Navigating to login page...')
  }

  // Handler for back to home
  const handleBackToHome = () => {
    console.log('Back to home clicked. Navigating to homepage...')
  }

  return (
    <div
      data-theme='pastel'
      className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='card w-full max-w-lg bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='text-3xl font-bold text-center text-primary-content'>
            Sign Up
          </h2>

          {/* Form */}
          <form onSubmit={handleSignUp}>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Name</span>
              </label>
              <input
                type='text'
                placeholder='Enter your name'
                className='input input-bordered w-full'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }} // onChange handler for name
                required
              />
            </div>

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

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Confirm Password</span>
              </label>
              <input
                type='password'
                placeholder='Confirm your password'
                className='input input-bordered w-full'
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                }} // onChange handler for confirm password
                required
              />
              {password !== confirmPassword && (
                <p className='text-red-500 mt-1'>Passwords do not match!</p>
              )}
            </div>

            {/* Sign Up Button */}
            <div className='form-control mt-6'>
              <button type='submit' className='btn btn-primary w-full'>
                Sign Up
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className='divider'>OR</div>

          {/* Google Sign Up Button */}
          <button
            className='btn btn-outline w-full'
            onClick={handleGoogleSignUp}>
            Sign Up with Google
          </button>

          {/* Login and Back Links */}
          <p className='mt-4 text-center'>
            Already have an account?{' '}
            <NavLink
              to='/login'
              onClick={handleLoginRedirect}
              className='link link-hover text-primary'>
              Login
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

export default SignUp
