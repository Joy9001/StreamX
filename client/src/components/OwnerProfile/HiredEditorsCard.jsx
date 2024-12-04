import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

function HiredEditorsCard() {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userData = useSelector((state) => state.user.userData)

  useEffect(() => {
    const fetchHiredByOwners = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/editorProfile/hiredby/${userData._id}`
        )
        setOwners(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch owners')
      } finally {
        setLoading(false)
      }
    }

    if (userData?._id) {
      fetchHiredByOwners()
    }
  }, [userData])

  if (loading) {
    return (
      <div className='flex-1 rounded-lg bg-white p-6 shadow-lg'>
        <div className='flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-pink-300 border-t-transparent'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex-1 rounded-lg bg-white p-6 shadow-lg'>
        <p className='text-center text-red-500'>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className='flex-1 rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Hired Editors
        </h3>
        <span className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'>
          {owners.length} Editors
        </span>
      </div>

      {owners.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <div className='mb-4'>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className='text-center text-gray-500'>No Editor Hired</p>
        </div>
      ) : (
        <ul className='space-y-4'>
          {owners.map((owner) => (
            <li
              key={owner._id}
              className='flex items-center justify-between border-b pb-4'>
              <div className='flex items-center gap-4'>
                <div className='h-10 w-10 overflow-hidden rounded-full'>
                  <img
                    src={owner.profilephoto || "https://imgix.ranker.com/list_img_v2/1360/2681360/original/the-best-ichigo-quotes?auto=format&q=50&fit=crop&fm=pjpg&dpr=2&crop=faces&h=185.86387434554973&w=355"}
                    alt={owner.username}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium text-gray-800'>
                    {owner.username}
                  </span>
                  <span className='text-sm text-gray-500'>{owner.email}</span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {owner.YTchannelname && (
                  <a
                    href={owner.ytChannelLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-200'>
                    YouTube
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HiredEditorsCard