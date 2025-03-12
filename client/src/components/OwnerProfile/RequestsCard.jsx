import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function RequestsCard() {
  const userData = useSelector((state) => state.user.userData)
  const [requestStats, setRequestStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    pendingRequests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRequestStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/requests/aggregate/${userData._id}`
        )
        console.log('Request Stats Response:', response.data)

        setRequestStats({
          totalRequests: response.data.totalRequests || 0,
          approvedRequests: response.data.approvedRequests || 0,
          rejectedRequests: response.data.rejectedRequests || 0,
          pendingRequests: response.data.pendingRequests || 0,
        })
        setError(null)
      } catch (err) {
        console.error('Error fetching request stats:', err)
        setError('Failed to fetch request statistics')
      } finally {
        setLoading(false)
      }
    }

    if (userData?._id) {
      fetchRequestStats()
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
        <p className='text-center text-red-500'>{error}</p>
      </div>
    )
  }

  return (
    <div className='w-[300px] rounded-lg bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          Requests
        </h3>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between rounded-lg bg-gray-50 p-2'>
          <span className='text-gray-600'>Total Requests</span>
          <span className='text-xl font-semibold text-gray-800'>
            {requestStats.totalRequests}
          </span>
        </div>

        <div className='flex items-center justify-between rounded-lg bg-green-50 p-2'>
          <span className='text-gray-600'>Approved</span>
          <span className='text-xl font-semibold text-green-600'>
            {requestStats.approvedRequests}
          </span>
        </div>

        <div className='flex items-center justify-between rounded-lg bg-red-50 p-2'>
          <span className='text-gray-600'>Rejected</span>
          <span className='text-xl font-semibold text-red-600'>
            {requestStats.rejectedRequests}
          </span>
        </div>

        <div className='flex items-center justify-between rounded-lg bg-yellow-50 p-2'>
          <span className='text-gray-600'>Pending</span>
          <span className='text-xl font-semibold text-yellow-600'>
            {requestStats.pendingRequests}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RequestsCard
