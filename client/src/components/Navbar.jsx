import {
  BarChart2,
  ChevronLeft,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Settings,
  User,
  Video,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { navbarOpenState } from '../states/navbarState.js'

function Navbar() {
  const [open, setOpen] = useRecoilState(navbarOpenState)
  const [showPopup, setShowPopup] = useState(false)
  const popupRef = useRef(null)

  const Menus = [
    { title: 'Dashboard', icon: LayoutDashboard },
    { title: 'Profile', icon: User },
    { title: 'Analytics', icon: BarChart2 },
    { title: 'Videos', icon: Video },
    { title: 'Settings', icon: Settings },
  ]

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
            onClick={() => setOpen(!open)}
          />

          {/* Logo and title */}
          <div className={`flex items-center gap-x-4 ${open && 'mr-16'}`}>
            <img
              src='./src/assets/logoX.png'
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
                className={`mt-2 flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm ease-in hover:bg-secondary hover:duration-300`}>
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
          {open && (
            <>
              <div className='flex flex-col'>
                <span className='font-medium'>Rishabh Raj</span>
                <span className='text-xs text-gray-500'>rishabh@gmail.com</span>
              </div>
              <div className='relative'>
                <MoreVertical
                  className='h-5 w-5 cursor-pointer'
                  onClick={() => setShowPopup(!showPopup)}
                />
                {showPopup && (
                  <div
                    ref={popupRef}
                    className='absolute bottom-full right-0 mb-2 w-48 overflow-hidden rounded-md bg-gray-200 text-white shadow-lg'>
                    <div className='border-b border-gray-700 px-4 py-2 font-semibold text-gray-700'>
                      My Account
                    </div>
                    <ul>
                      <li className='flex cursor-pointer items-center px-4 py-2 text-gray-700 hover:bg-secondary'>
                        <User className='mr-2 h-4 w-4' />
                        Profile
                      </li>
                      <li className='flex cursor-pointer items-center px-4 py-2 text-gray-700 hover:bg-secondary'>
                        <HelpCircle className='mr-2 h-4 w-4' />
                        Support
                      </li>
                      <li className='flex cursor-pointer items-center px-4 py-2 text-red-500 hover:bg-accent'>
                        <LogOut className='mr-2 h-4 w-4' />
                        Log out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
