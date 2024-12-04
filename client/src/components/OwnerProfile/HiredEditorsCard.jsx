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
      <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg'>
        <div className='flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-pink-300 border-t-transparent'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg'>
        <p className='text-center text-red-500'>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Hired By
        </h3>
      </div>
      {owners.length === 0 ? (
        <p className='text-center text-gray-500'>No owners have hired you yet.</p>
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