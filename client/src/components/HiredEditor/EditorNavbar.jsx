import React from 'react'
import { useNavigate } from 'react-router-dom'

function EditorNavbar() {
  const navigate = useNavigate()

  return (
    <nav className='sticky top-0 z-50 bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-purple-50/90 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all duration-300 ease-in-out'>
      <div className='relative w-full'>
        <div className='flex h-16 items-center'>
          {/* Logo at absolute corner */}
          <div className='absolute left-0 top-0 h-full flex items-center pl-3'>
            <a
              className='text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent hover:from-rose-400 hover:to-purple-500 transition-all duration-300 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/40'
              onClick={() => navigate('/storage')}>
              StreamX
            </a>
          </div>

          {/* Desktop Menu - Centered */}
          <div className='hidden lg:flex flex-1 justify-center items-center space-x-2'>
            <a
              className='px-5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm active:scale-95 transition-all duration-300 cursor-pointer font-medium'
              onClick={() => navigate('/storage')}>
              Storage
            </a>
            <a
              className='px-5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm active:scale-95 transition-all duration-300 cursor-pointer font-medium'
              onClick={() => navigate('/profile/owner')}>
              Profile
            </a>
            <a
              className='px-5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm active:scale-95 transition-all duration-300 cursor-pointer font-medium'
              onClick={() => navigate('/raas')}>
              Request Section
            </a>
          </div>

          {/* Mobile Menu - Right Corner */}
          <div className='lg:hidden absolute right-3 top-0 h-full flex items-center'>
            <div className='dropdown dropdown-end'>
              <button
                tabIndex={0}
                role='button'
                className='p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm active:scale-95 transition-all duration-300'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <ul
                tabIndex={0}
                className='menu dropdown-content mt-3 w-56 rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 backdrop-blur-sm p-2 transition-all duration-300 ease-in-out'>
                <li className='mb-1'>
                  <a
                    className='block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 rounded-lg transition-colors duration-300 font-medium'
                    onClick={() => navigate('/storage')}>
                    Storage
                  </a>
                </li>
                <li className='mb-1'>
                  <a
                    className='block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 rounded-lg transition-colors duration-300 font-medium'
                    onClick={() => navigate('/profile')}>
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    className='block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 rounded-lg transition-colors duration-300 font-medium'
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
