import { LogOut, MoreVertical, User } from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function NavProfile({ logout, user }) {
  const popupRef = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user.userData)

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

  const handleProfileClick = () => {
    const userRole = userData?.user_metadata?.role
    if (userRole === 'Owner') {
      navigate('/profile/owner')
    } else if (userRole === 'Editor') {
      navigate('/profile/editor')
    }
    setShowPopup(false)
  }

  return (
    <>
      <div className='flex flex-col'>
        <span className='font-medium'>{user.name}</span>
        <span className='text-xs text-gray-500'>{user.email}</span>
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
              <li
                onClick={handleProfileClick}
                className='flex cursor-pointer items-center px-4 py-2 text-gray-700 hover:bg-secondary'>
                <User className='mr-2 h-4 w-4' />
                Profile
              </li>
              <li
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
                className='flex cursor-pointer items-center px-4 py-2 text-red-500 hover:bg-accent'>
                <LogOut className='mr-2 h-4 w-4' />
                Log out
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

NavProfile.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
}

export default NavProfile
