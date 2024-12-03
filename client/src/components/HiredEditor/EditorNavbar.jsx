import React from 'react'
import { useNavigate } from 'react-router-dom'

function EditorNavbar() {
  const navigate = useNavigate()

  return (
    <nav className='sticky top-0 z-50 border-b border-gray-100 bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-purple-50/90 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all duration-300 ease-in-out'>
      <div className='relative w-full'>
        <div className='flex h-16 items-center'>
          {/* Logo at absolute corner */}
          <div className='absolute left-0 top-0 flex h-full items-center pl-3'>
            <a
              className='cursor-pointer rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text px-3 py-2 text-2xl font-bold text-transparent transition-all duration-300 hover:bg-white/40 hover:from-rose-400 hover:to-purple-500'
              onClick={() => navigate('/storage')}>
              StreamX
            </a>
          </div>

          {/* Desktop Menu - Centered */}
          <div className='hidden flex-1 items-center justify-center space-x-2 lg:flex'>
            <a
              className='cursor-pointer rounded-lg px-5 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm active:scale-95'
              onClick={() => navigate('/storage')}>
              Storage
            </a>
            <a
              className='cursor-pointer rounded-lg px-5 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm active:scale-95'
              onClick={() => navigate('/profile/owner')}>
              Profile
            </a>
            <a
              className='cursor-pointer rounded-lg px-5 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm active:scale-95'
              onClick={() => navigate('/raas')}>
              Request Section
            </a>
          </div>

          {/* Mobile Menu - Right Corner */}
          <div className='absolute right-3 top-0 flex h-full items-center lg:hidden'>
            <div className='dropdown dropdown-end'>
              <button
                tabIndex={0}
                role='button'
                className='rounded-lg p-2.5 text-gray-600 transition-all duration-300 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm active:scale-95'>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </button>
              <ul
                tabIndex={0}
                className='menu dropdown-content mt-3 w-56 rounded-xl bg-white/95 p-2 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 ease-in-out'>
                <li className='mb-1'>
                  <a
                    className='block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-300 hover:bg-gray-50/80 hover:text-gray-900'
                    onClick={() => navigate('/storage')}>
                    Storage
                  </a>
                </li>
                <li className='mb-1'>
                  <a
                    className='block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-300 hover:bg-gray-50/80 hover:text-gray-900'
                    onClick={() => navigate('/profile')}>
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    className='block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-300 hover:bg-gray-50/80 hover:text-gray-900'
                    onClick={() => navigate('/raaq')}>
                    Raaq
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default EditorNavbar
