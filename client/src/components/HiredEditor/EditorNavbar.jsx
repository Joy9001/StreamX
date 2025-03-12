import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, User, FileText, Menu, Zap } from 'lucide-react'

function NavItem({ icon, text, onClick, isActive }) {
  return (
    <li className='flex'>
      <button
        onClick={onClick}
        className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          isActive
            ? 'bg-purple-100 text-purple-700'
            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
        }`}>
        {React.cloneElement(icon, {
          className: `h-5 w-5 ${isActive ? 'text-purple-700' : 'text-gray-500'}`,
        })}
        <span>{text}</span>
      </button>
    </li>
  )
}

function EditorNavbar() {
  const navigate = useNavigate()
  const currentPath = window.location.pathname

  // Determine which nav item is active
  const isActive = (path) => {
    return currentPath.includes(path)
  }

  return (
    <nav className='sticky top-0 z-50 w-full bg-white shadow-sm'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <div className='flex shrink-0 items-center'>
          <button
            className='group flex items-center space-x-2 rounded-lg px-2 py-1 transition-all hover:bg-purple-50'
            onClick={() => navigate('/storage')}>
            <Zap className='h-6 w-6 text-purple-600' />
            <span className='bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent'>
              StreamX
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:block'>
          <ul className='flex items-center space-x-2'>
            <NavItem
              icon={<Home />}
              text='Storage'
              onClick={() => navigate('/storage')}
              isActive={isActive('/storage')}
            />
            <NavItem
              icon={<User />}
              text='Profile'
              onClick={() => navigate('/profile/owner')}
              isActive={isActive('/profile')}
            />
            <NavItem
              icon={<FileText />}
              text='Request Section'
              onClick={() => navigate('/req-n-approve')}
              isActive={isActive('/req-n-approve')}
            />
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden'>
          <div className='relative'>
            <button
              className='flex items-center rounded-full p-2 text-gray-500 hover:bg-gray-100'
              onClick={() => {
                const dropdown = document.getElementById('mobile-menu')
                if (dropdown) {
                  dropdown.classList.toggle('hidden')
                }
              }}>
              <Menu className='h-6 w-6' />
            </button>

            {/* Mobile Menu Dropdown */}
            <div
              id='mobile-menu'
              className='absolute right-0 mt-2 hidden w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <button
                onClick={() => navigate('/storage')}
                className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700'>
                Storage
              </button>
              <button
                onClick={() => navigate('/profile/owner')}
                className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700'>
                Profile
              </button>
              <button
                onClick={() => navigate('/req-n-approve')}
                className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700'>
                Request Section
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default EditorNavbar
