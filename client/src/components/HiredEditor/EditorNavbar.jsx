import React from 'react'
import { useNavigate } from 'react-router-dom'

function EditorNavbar() {
  const navigate = useNavigate()

  return (
    <nav className='navbar bg-red-500 shadow-lg transition-all duration-300 ease-in-out'>
      {/* Navbar Start */}
      <div className='navbar-start'>
        <div className='dropdown'>
          <button
            tabIndex={0}
            role='button'
            className='btn btn-ghost text-white hover:text-gray-200 lg:hidden'>
            ☰
          </button>
          <ul
            tabIndex={0}
            className='menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-lg bg-red-500 p-2 shadow-lg transition-all duration-300 ease-in-out'>
            <li>
              <a
                className='rounded-md text-white hover:bg-red-400 hover:text-gray-100'
                onClick={() => navigate('/storage')}>
                Storage
              </a>
            </li>
            <li>
              <a
                className='rounded-md text-white hover:bg-red-400 hover:text-gray-100'
                onClick={() => navigate('/profile')}>
                Profile
              </a>
            </li>
            <li>
              <a
                className='rounded-md text-white hover:bg-red-400 hover:text-gray-100'
                onClick={() => navigate('/raaq')}>
                Raaq
              </a>
            </li>
          </ul>
        </div>
        {/* Logo */}
        <a
          className='btn btn-ghost text-2xl font-bold text-white transition-colors duration-300 hover:text-gray-200'
          onClick={() => navigate('/storage')}>
          StreamX
        </a>
      </div>

      {/* Navbar Center */}
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal space-x-6'>
          <li>
            <a
              className='text-xl text-white transition-colors duration-300 hover:text-gray-200'
              onClick={() => navigate('/storage')}>
              Storage
            </a>
          </li>
          <li>
            <a
              className='text-xl text-white transition-colors duration-300 hover:text-gray-200'
              onClick={() => navigate('/profile/owner')}>
              Profile
            </a>
          </li>
          <li>
            <a
              className='text-xl text-white transition-colors duration-300 hover:text-gray-200'
              onClick={() => navigate('/raas')}>
              Raas
            </a>
          </li>
        </ul>
      </div>

      {/* Navbar End */}
      <div className='navbar-end'>
        <a
          className='btn rounded-lg px-5 py-2 text-red-100 shadow-md transition-all duration-300'
          onClick={() => navigate('/settings')}>
          Settings
        </a>
      </div>
    </nav>
  )
}

export default EditorNavbar
