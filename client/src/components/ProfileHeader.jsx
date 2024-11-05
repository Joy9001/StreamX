import { useState, useRef, useEffect } from 'react'
import { List, Bell } from 'lucide-react'

function ProfileHeader() {
  const [showBellPopup, setShowBellPopup] = useState(false)
  const [showListPopup, setShowListPopup] = useState(false)
  const bellPopupRef = useRef(null)
  const listPopupRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        bellPopupRef.current &&
        !bellPopupRef.current.contains(event.target)
      ) {
        setShowBellPopup(false)
      }
      if (
        listPopupRef.current &&
        !listPopupRef.current.contains(event.target)
      ) {
        setShowListPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    //header

    <div className='flex items-center justify-between bg-gray-50'>
      <div className='ml-24'>
        <h1 className='text-2xl font-bold'>
          Profile <span className='text-red-500'>Page</span>
        </h1>
      </div>

      <div className='m-4 mx-8 flex items-center justify-center gap-x-4'>
        <div className='search_sapce p-2'>
          <label className='input input-bordered flex w-72 items-center gap-2 shadow-xl'>
            <input type='text' placeholder='Search' className='grow' />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'>
              <path
                fillRule='evenodd'
                d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                clipRule='evenodd'
              />
            </svg>
          </label>
        </div>
        <div className='relative'>
          <List
            size={28}
            className='cursor-pointer text-gray-600'
            onClick={() => setShowListPopup(!showListPopup)}
          />
          {showListPopup && (
            <div
              ref={listPopupRef}
              className='absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg'>
              <div className='px-4 py-2 text-sm text-gray-700'>
                A new request arrived
              </div>
            </div>
          )}
        </div>
        <div className='relative'>
          <div className='indicator'>
            <span className='badge indicator-item badge-accent badge-sm'></span>
            <Bell
              size={28}
              className='cursor-pointer text-gray-600'
              onClick={() => setShowBellPopup(!showBellPopup)}
            />
          </div>
          {showBellPopup && (
            <div
              ref={bellPopupRef}
              className='absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg'>
              <div className='px-4 py-2 text-sm text-gray-700'>
                A new request arrived
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
