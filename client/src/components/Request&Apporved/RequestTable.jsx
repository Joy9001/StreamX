import { useAuth0 } from '@auth0/auth0-react'
import {
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Film,
  IndianRupee,
  MessageSquare,
  Save,
  User,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearAllMessages,
  fetchMessageCounts,
} from '../../store/slices/messageSlice'
import {
  changeRequestPrice,
  fetchRequestsFromUser,
} from '../../store/slices/requestSlice'
import MessageThread from './MessageThread'

function RequestTable() {
  const { getAccessTokenSilently } = useAuth0()
  const dispatch = useDispatch()
  const { sentRequests, loading, error } = useSelector(
    (state) => state.requests
  )
  const { messageCounts } = useSelector((state) => state.messages)
  const userData = useSelector((state) => state.user.userData)
  const userRole = userData?.user_metadata?.role
  const [editingPrice, setEditingPrice] = useState({})
  const [newPrices, setNewPrices] = useState({})
  const [priceErrors, setPriceErrors] = useState({})
  const isEditor = userRole === 'Editor'

  // Reset messages when component mounts
  useEffect(() => {
    dispatch(clearAllMessages())
  }, [dispatch])

  useEffect(() => {
    const fetchData = async () => {
      if (!userData) return

      // Extract the MongoDB ID - depending on your data structure
      const userId = userData._id || userData.sub || userData.id

      if (!userId) {
        console.error('No valid user ID found in userData:', userData)
        return
      }

      try {
        const accessToken = await getAccessTokenSilently()
        console.log('Fetching requests with ID:', userId)
        dispatch(
          fetchRequestsFromUser({
            id: userId,
            accessToken,
          })
        )
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }

    fetchData()
  }, [dispatch, getAccessTokenSilently, userData])

  // Fetch message counts for all requests when requests are loaded
  useEffect(() => {
    const fetchCounts = async () => {
      if (!sentRequests || sentRequests.length === 0 || !userData) return

      try {
        const accessToken = await getAccessTokenSilently()
        const requestIds = sentRequests.map((request) => request._id)

        dispatch(
          fetchMessageCounts({
            requestIds,
            accessToken,
          })
        )
      } catch (error) {
        console.error('Error fetching message counts:', error)
      }
    }

    fetchCounts()
  }, [sentRequests, getAccessTokenSilently, userData, dispatch])

  if (loading || !userRole) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex items-center rounded-lg bg-blue-50 p-4 text-blue-800'>
          <Clock className='mr-2 h-5 w-5 animate-spin text-blue-600' />
          <span className='font-medium'>Loading request data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex items-center rounded-lg bg-red-50 p-4 text-red-800'>
          <XCircle className='mr-2 h-5 w-5 text-red-600' />
          <span className='font-medium'>
            Error loading requests:{' '}
            {typeof error === 'object'
              ? error.message || 'Unknown error'
              : error}
          </span>
        </div>
      </div>
    )
  }

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
      case 'rejected':
        return <XCircle className='mr-2 h-4 w-4 text-red-500' />
      default:
        return <Clock className='mr-2 h-4 w-4 text-yellow-500' />
    }
  }

  // Function to get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  // Handle starting price edit
  const handleEditPrice = (requestId, currentPrice) => {
    setEditingPrice((prev) => ({ ...prev, [requestId]: true }))
    setNewPrices((prev) => ({ ...prev, [requestId]: currentPrice }))
    setPriceErrors((prev) => ({ ...prev, [requestId]: '' }))
  }

  // Handle price change
  const handlePriceChange = (requestId, value) => {
    const numValue = parseInt(value, 10)
    setNewPrices((prev) => ({ ...prev, [requestId]: value }))

    if (isNaN(numValue) || numValue <= 0) {
      setPriceErrors((prev) => ({
        ...prev,
        [requestId]: 'Price must be a positive number',
      }))
    } else {
      setPriceErrors((prev) => ({ ...prev, [requestId]: '' }))
    }
  }

  // Handle save price
  const handleSavePrice = async (requestId) => {
    const price = parseInt(newPrices[requestId], 10)

    if (isNaN(price) || price <= 0) {
      setPriceErrors((prev) => ({
        ...prev,
        [requestId]: 'Price must be a positive number',
      }))
      return
    }

    try {
      const accessToken = await getAccessTokenSilently()
      await dispatch(
        changeRequestPrice({
          id: requestId,
          price,
          accessToken,
        })
      ).unwrap()

      // Reset editing state
      setEditingPrice((prev) => ({ ...prev, [requestId]: false }))
    } catch (error) {
      console.error('Failed to update price:', error)
      setPriceErrors((prev) => ({
        ...prev,
        [requestId]: error.message || 'Failed to update price',
      }))
    }
  }

  // Determine header gradient and icon colors based on role
  const headerGradient = isEditor
    ? 'from-purple-50 to-indigo-50'
    : 'from-teal-50 to-blue-50'
  const iconColor = isEditor ? 'text-purple-500' : 'text-teal-500'
  const iconBgColor = isEditor ? 'bg-purple-100' : 'bg-teal-100'
  const iconTextColor = isEditor ? 'text-purple-600' : 'text-teal-600'

  return (
    <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full divide-y divide-gray-200'>
          <thead className={`bg-gradient-to-r ${headerGradient}`}>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <Film className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Video Name
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <User className={`mr-2 h-4 w-4 ${iconColor}`} />
                  {isEditor ? 'Owner Name' : 'Editor Name'}
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <FileText className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Description
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <IndianRupee className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Price
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <Clock className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Status
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <MessageSquare className={`mr-2 h-4 w-4 ${iconColor}`} />
                  Negotiate
                </div>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => (
                <tr
                  key={request._id}
                  className='transition-colors duration-150 hover:bg-gray-50'>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='flex items-center'>
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${iconBgColor}`}>
                        <Film className={`h-5 w-5 ${iconTextColor}`} />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {request.video.title || 'Untitled Video'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='flex items-center'>
                      <div className='h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200'>
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            request.to.name || 'User'
                          )}&background=random&color=fff`}
                          alt={request.to.name}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div className='ml-3'>
                        <div className='text-sm font-medium text-gray-900'>
                          {request.to.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='max-w-xs text-sm text-gray-900'>
                      {request.description}
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      {!isEditor && request.status === 'pending' ? (
                        editingPrice[request._id] ? (
                          <div className='flex flex-col'>
                            <div className='flex items-center'>
                              <div className='relative flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-blue-700'>
                                <IndianRupee className='mr-1 h-3.5 w-3.5' />
                                <input
                                  type='number'
                                  min='1'
                                  value={newPrices[request._id] || ''}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      request._id,
                                      e.target.value
                                    )
                                  }
                                  className='w-20 bg-transparent p-0 focus:outline-none'
                                  aria-label='Edit price'
                                />
                                <button
                                  onClick={() => handleSavePrice(request._id)}
                                  className='ml-2 rounded-full p-1 hover:bg-blue-100'
                                  title='Save price'
                                  aria-label='Save price'>
                                  <Save className='h-3.5 w-3.5 text-blue-600' />
                                </button>
                              </div>
                            </div>
                            {priceErrors[request._id] && (
                              <span className='mt-1 text-xs text-red-500'>
                                {priceErrors[request._id]}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className='flex items-center'>
                            <span className='flex items-center rounded-full bg-green-50 px-2.5 py-1 text-green-700'>
                              <IndianRupee className='mr-1 h-3.5 w-3.5' />
                              {request.price}
                            </span>
                            <button
                              onClick={() =>
                                handleEditPrice(request._id, request.price)
                              }
                              className='ml-2 rounded-full p-1 hover:bg-gray-100'
                              title='Edit price'
                              aria-label='Edit price'>
                              <Edit className='h-3.5 w-3.5 text-gray-500' />
                            </button>
                          </div>
                        )
                      ) : (
                        <span className='flex items-center rounded-full bg-green-50 px-2.5 py-1 text-green-700'>
                          <IndianRupee className='mr-1 h-3.5 w-3.5' />
                          {request.price}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        request.status
                      )}`}>
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <MessageThread
                      requestId={request._id}
                      requestStatus={request.status}
                      messageCount={messageCounts[request._id] || 0}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan='6'
                  className='px-6 py-10 text-center text-sm text-gray-500'>
                  <div className='flex flex-col items-center justify-center'>
                    <FileText className='mb-2 h-10 w-10 text-gray-400' />
                    <p className='font-medium'>No requests found</p>
                    <p className='mt-1 text-xs text-gray-400'>
                      When you make requests, they will appear here
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RequestTable
