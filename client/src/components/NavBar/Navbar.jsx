import { setNavbarOpen } from '@/store/slices/uiSlice.js'
import { useAuth0 } from '@auth0/auth0-react'
import { Briefcase, ChevronLeft, Settings, User, Video } from 'lucide-react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NavLogin from './NavLogin.jsx'
import NavProfile from './NavProfile.jsx'
function Navbar({ title }) {
  const open = useSelector((state) => state.ui.navbarOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()
  console.log('user in navbar', user)

  const Menus = [
    // { title: 'Dashboard', icon: LayoutDashboard },
    { title: 'Profile', icon: User, route: '/profile/owner' },
    // { title: 'Analytics', icon: BarChart2 },
    { title: 'Storage', icon: Video, route: '/storage?login=true' },
    { title: 'Hire Editors', icon: Briefcase, route: '/HireEditor' },
    { title: 'raas', icon: Settings, route: '/raas' },
  ]

  return (
    <>
      {/* NAVBAR */}
      <div
        className={`${
          open ? 'w-full' : 'w-20'
        } relative flex h-screen flex-shrink-0 flex-col justify-between bg-gray-100 p-5 pt-6 transition-all duration-300`}>
        <div className='flex w-full flex-col items-center justify-center'>
          {/* Arrow toggle button */}
          <ChevronLeft
            className={`absolute -right-3 top-9 h-7 w-7 cursor-pointer rounded-full border-2 border-gray-50 bg-white text-black shadow-xl ${
              !open && 'rotate-180'
            }`}
            onClick={() => dispatch(setNavbarOpen(!open))}
          />

          {/* Logo and title */}
          <div className={`flex items-center gap-x-4 ${open && 'mr-16'}`}>
            <img
              src='http://localhost:5173/src/assets/logoX.png'
              alt='Logo'
              className={`w-14 cursor-pointer rounded-full bg-black duration-500`}
            />
            {open && (
              <h1
                className={`origin-left text-xl font-bold duration-300 ${!open && 'scale-0'}`}>
                Stream<span className='text-xl font-bold text-red-600'>X</span>
              </h1>
            )}
          </div>
          <ul
            className={`flex w-full flex-col items-center justify-center pt-6 *:w-full ${open ? '*:justify-left' : '*:justify-center'}`}>
            {Menus.map((menu, index) => (
              <li
                key={index}
                className={`mt-2 flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm ease-in hover:bg-secondary hover:duration-300 ${title == menu.title ? 'bg-secondary' : ''}`}
                onClick={() => navigate(`${menu.route}`)}>
                <menu.icon className='h-5 w-5' />
                <span
                  className={`${!open && 'hidden'} origin-left duration-200`}>
                  {menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* User profile section */}
        <div
          className={`mt-auto flex items-center gap-x-4 ${open ? 'justify-between' : 'justify-center'}`}>
          <img
            src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            alt='User'
            className='h-10 w-10 rounded-full'
          />
          {open &&
            (isAuthenticated ? (
              <NavProfile logout={logout} user={user} />
            ) : (
              <NavLogin loginWithRedirect={loginWithRedirect} />
            ))}
        </div>
      </div>
    </>
  )
}

Navbar.propTypes = {
  title: PropTypes.string,
}
export default Navbar
