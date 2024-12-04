import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const membershipStyles = {
  Free: 'bg-white text-gray-700 border border-gray-300',
  Bronze: 'bg-amber-700 text-white',
  Silver: 'bg-gray-400 text-white',
  Gold: 'bg-yellow-500 text-white',
}

function ProfileCard({ onEditProfile }) {
  const [ownerData, setOwnerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // const { user } = useAuth0()
  const userData = useSelector((state) => state.user.userData)

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const ownerId = userData._id
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/owner/profile/${ownerId}`)
        console.log('Fetched owner data:', response.data)
        setOwnerData({
          username: response.data.username,
          ytChannelname: response.data.YTchannelname,
          bio: response.data.bio || 'No bio added yet',
          membership: response.data.storageLimit <= 10240 ? 'Free' : 
                     response.data.storageLimit <= 102400 ? 'Bronze' : 
                     response.data.storageLimit <= 512000 ? 'Silver' : 'Gold'
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch owner data')
      } finally {
        setLoading(false)
      }
    }

    if (userData && userData._id) {
      fetchOwnerData()
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
      <img
        src="https://imgix.ranker.com/list_img_v2/1360/2681360/original/the-best-ichigo-quotes?auto=format&q=50&fit=crop&fm=pjpg&dpr=2&crop=faces&h=185.86387434554973&w=355"
        alt="Profile"
        className='border-primary-100 mx-auto block h-[100px] w-[100px] rounded-full border-4 object-cover shadow-md'
      />
      <h2 className='mt-4 text-center text-xl font-bold text-gray-800'>
        {ownerData?.username}
      </h2>
      <p className='text-center text-gray-600'>
        {ownerData?.ytChannelname}
      </p>
      <div className='mt-2 flex justify-center'>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${membershipStyles[ownerData?.membership]}`}>
          {ownerData?.membership}
        </span>
      </div>
      <p className='mt-4 text-center text-sm text-gray-500'>
        {ownerData?.bio}
      </p>
      <div className='mt-6'>
        <button
          onClick={onEditProfile}
          className='btn w-full border-none bg-pink-200 text-gray-700 hover:bg-pink-300'>
          EDIT PROFILE
        </button>
      </div>
    </div>
  )
}

export default ProfileCard