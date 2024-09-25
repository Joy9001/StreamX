import { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  LayoutDashboard,
  User,
  BarChart2,
  Video,
  Settings,
  MoreVertical,
  LogOut,
  HelpCircle,
} from 'lucide-react'

function Navbar() {
  const [open, setOpen] = useState(true)
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
    <div className='flex'>
      {/* NAVBAR */}
      <div
        className={`${
          open ? 'w-72' : 'w-20'
        } h-screen p-5 pt-6 bg-gray-100 relative transition-all duration-300 flex-shrink-0 flex flex-col justify-between`}>
        <div>
          {/* Arrow toggle button */}
          <ChevronLeft
            className={`absolute cursor-pointer -right-3 top-9 w-7 h-7 border-2 border-gray-50 rounded-full bg-white text-black shadow-xl ${
              !open && 'rotate-180'
            }`}
            onClick={() => setOpen(!open)}
          />

          {/* Logo and title */}
          <div className='flex gap-x-4 items-center'>
            <img
              src='./src/assets/logoX.png'
              alt='Logo'
              className={`w-14 cursor-pointer duration-500 bg-black rounded-full`}
            />
            <h1
              className={`origin-left font-bold text-xl duration-300 ${!open && 'scale-0'}`}>
              Stream<span className='text-red-600 font-bold text-xl'>X</span>
            </h1>
          </div>
          <ul className='pt-6'>
            {Menus.map((menu, index) => (
              <li
                key={index}
                className={`flex items-center gap-x-4 p-2 text-sm hover:bg-secondary hover:duration-300 ease-in rounded-md mt-2 cursor-pointer`}>
                <menu.icon className='w-5 h-5' />
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
          className={`flex items-center gap-x-4 p-2 mt-auto ${open ? 'justify-between' : 'justify-center'}`}>
          <img
            src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            alt='User'
            className='w-10 h-10 rounded-full'
          />
          {open && (
            <>
              <div className='flex flex-col'>
                <span className='font-medium'>Rishabh Raj</span>
                <span className='text-xs text-gray-500'>rishabh@gmail.com</span>
              </div>
              <div className='relative'>
                <MoreVertical
                  className='w-5 h-5 cursor-pointer'
                  onClick={() => setShowPopup(!showPopup)}
                />
                {showPopup && (
                  <div
                    ref={popupRef}
                    className='absolute bottom-full right-0 mb-2 w-48 bg-gray-200 text-white shadow-lg rounded-md overflow-hidden'>
                    <div className='px-4 py-2 font-semibold border-b border-gray-700 text-gray-700'>
                      My Account
                    </div>
                    <ul>
                      <li className='px-4 py-2 text-gray-700 cursor-pointer flex items-center  hover:bg-secondary '>
                        <User className='w-4 h-4 mr-2' />
                        Profile
                      </li>
                      <li className='px-4 py-2 text-gray-700 cursor-pointer flex items-center  hover:bg-secondary'>
                        <HelpCircle className='w-4 h-4 mr-2' />
                        Support
                      </li>
                      <li className='px-4 py-2 hover:bg-accent cursor-pointer flex items-center text-red-500'>
                        <LogOut className='w-4 h-4 mr-2' />
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

      {/* Main Content */}
      <div className='p-7 text-2xl font-semibold flex-1 h-screen'>
        <h1>DashBoard</h1>
      </div>
    </div>
  )
}

export default Navbar
