import { Button } from '@/components/ui/button'
import { useAuth0 } from '@auth0/auth0-react'
import {
  Home,
  ListFilter,
  LogOut,
  Package2,
  PanelLeft,
  Settings,
  Video,
} from 'lucide-react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import logoX from '../../assets/logoX.png'

export function AdminNav({ activePage }) {
  const navigate = useNavigate()
  const { logout } = useAuth0()

  const navItems = [
    { title: 'Dashboard', icon: Home, route: '/admin-panel' },
    { title: 'Videos', icon: Video, route: '/admin-panel/videos' },
    { title: 'Requests', icon: Package2, route: '/admin-panel/requests' },
    { title: 'Owners', icon: Settings, route: '/admin-panel/owners' },
    { title: 'Editors', icon: ListFilter, route: '/admin-panel/editors' },
  ]

  const currentPath = navItems.find((item) => item.title === activePage)?.route
  const isActive = (route) => {
    return currentPath === route
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <>
      {/* Sidebar - Mobile */}
      <div className='md:hidden'>
        <div className='fixed left-4 top-4 z-40'>
          <Button
            variant='outline'
            size='icon'
            className='fixed left-4 top-4 z-40'>
            <PanelLeft className='h-4 w-4' />
          </Button>
        </div>
        <nav className='fixed h-full w-64 bg-white shadow-sm'>
          <div className='mb-6 flex justify-center gap-1 p-4'>
            <img src={logoX} alt='StreamX Logo' className='h-12 w-auto' />
            <span className='text-3xl font-bold text-black'>StreamX</span>
          </div>
          {navItems.map((item) => (
            <Link key={item.route} to={item.route}>
              <Button
                variant='ghost'
                className={`w-full justify-start gap-2 ${
                  isActive(item.route)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}>
                <item.icon className='h-4 w-4' />
                {item.title}
              </Button>
            </Link>
          ))}
          <Button
            variant='ghost'
            className='w-full justify-start gap-2 text-red-500 hover:text-red-700'
            onClick={handleLogout}>
            <LogOut className='h-4 w-4' />
            Logout
          </Button>
        </nav>
      </div>

      {/* Sidebar - Desktop */}
      <div className='hidden md:flex'>
        <div className='fixed h-full w-64 bg-white shadow-sm'>
          <nav className='flex h-full flex-col gap-2 p-4'>
            <div className='mb-6 flex justify-center gap-1'>
              <img src={logoX} alt='StreamX Logo' className='h-12 w-auto' />
              <span className='text-xl font-bold text-black'>StreamX</span>
            </div>
            {navItems.map((item) => (
              <Link key={item.route} to={item.route}>
                <Button
                  variant='ghost'
                  className={`w-full justify-start gap-2 ${
                    isActive(item.route)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}>
                  <item.icon className='h-4 w-4' />
                  {item.title}
                </Button>
              </Link>
            ))}
            <Button
              variant='ghost'
              className='w-full justify-start gap-2 text-red-500 hover:text-red-700'
              onClick={handleLogout}>
              <LogOut className='h-4 w-4' />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </>
  )
}

AdminNav.propTypes = {
  activePage: PropTypes.string,
}

export default AdminNav
