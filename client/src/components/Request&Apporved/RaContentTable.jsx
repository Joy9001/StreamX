import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Clock,
  CheckCircle,
  XCircle,
  Film,
  User,
  IndianRupee,
  FileText,
} from 'lucide-react'
import { fetchRequestsFromUser } from '../../store/slices/requestSlice'

function ContentTable() {
  const { getAccessTokenSilently } = useAuth0()
  const dispatch = useDispatch()
  const { sentRequests, loading, error } = useSelector((state) => state.requests)
  const userData = useSelector((state) => state.user.userData)
  const userRole = userData?.user_metadata?.role

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
        dispatch(fetchRequestsFromUser({
          id: userId,
          accessToken
        }))
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }

    fetchData()
  }, [dispatch, getAccessTokenSilently, userData])

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
          <span className='font-medium'>Error loading requests: {typeof error === 'object' ? (error.message || 'Unknown error') : error}</span>
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

  return (
    <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full divide-y divide-gray-200'>
          <thead className='bg-gradient-to-r from-teal-50 to-blue-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <Film className='mr-2 h-4 w-4 text-teal-500' />
                  Video
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <User className='mr-2 h-4 w-4 text-teal-500' />
                  {userRole === 'Owner' ? 'Editor' : 'Owner'}
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <FileText className='mr-2 h-4 w-4 text-teal-500' />
                  Description
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <IndianRupee className='mr-2 h-4 w-4 text-teal-500' />
                  Price
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                Status
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
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100'>
                        <Film className='h-5 w-5 text-teal-600' />
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
                            request.from.name || 'User'
                          )}&background=random&color=fff`}
                          alt={request.from.name}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div className='ml-3'>
                        <div className='text-sm font-medium text-gray-900'>
                          {request.from.name}
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
                      <span className='flex items-center rounded-full bg-green-50 px-2.5 py-1 text-green-700'>
                        <IndianRupee className='mr-1 h-3.5 w-3.5' />
                        {request.price}
                      </span>
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
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan='5'
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

export default ContentTable
