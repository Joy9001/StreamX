import React, { useState } from 'react'
import '../loginsignup.css' // Keeping this in case you're using additional custom styles

const SignIn = () => {
  const [activeForm, setActiveForm] = useState('login')

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      {/* Login Form */}
      {activeForm === 'login' && (
        <div className='w-full max-w-sm rounded-lg bg-white p-8 shadow-lg'>
          <h2 className='mb-6 text-center text-2xl font-semibold'>Login</h2>

          <div className='form-control mb-4'>
            <label className='label'>
              <span className='label-text'>Username</span>
            </label>
            <input
              type='text'
              placeholder='Enter your username'
              className='input input-bordered w-full'
              required
            />
          </div>

          <div className='form-control mb-4'>
            <label className='label'>
              <span className='label-text'>Password</span>
            </label>
            <input
              type='password'
              placeholder='Enter your password'
              className='input input-bordered w-full'
              required
            />
          </div>

          <button className='btn btn-primary mb-4 w-full'>Login</button>

          <button className='btn btn-outline mb-4 w-full'>
            Sign in with Google
          </button>

          <div className='mt-4 text-center'>
            <a href='/signup/owner' className='link'>
              Don't have an account? Sign Up
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignIn
