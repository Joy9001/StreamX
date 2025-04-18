import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CheckCircle,
  Clock,
  XCircle,
  Film,
  User,
  IndianRupee,
  FileText,
  ThumbsUp,
  MessageSquare
} from 'lucide-react'
import {
  fetchRequestsToUser,
  approveRequest,
  rejectRequest
} from '../../store/slices/requestSlice'
import { fetchMessageCounts, clearAllMessages } from '../../store/slices/messageSlice'
import MessageThread from './MessageThread'

function ContentTableApprove() {
  const { getAccessTokenSilently } = useAuth0()
  const dispatch = useDispatch()
  const { receivedRequests, loading, error } = useSelector((state) => state.requests)
  const { messageCounts, countLoading } = useSelector((state) => state.messages)
  const userData = useSelector((state) => state.user.userData)
  const userRole = userData?.user_metadata?.role
  const [selectedRequestId, setSelectedRequestId] = useState(null)

  // Reset messages when component mounts
  useEffect(() => {
    dispatch(clearAllMessages())
  }, [dispatch]);

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
        console.log('Fetching requests to approve with ID:', userId)
        dispatch(fetchRequestsToUser({
          id: userId,
          accessToken
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [dispatch, getAccessTokenSilently, userData])

  // Fetch message counts for all requests when requests are loaded
  useEffect(() => {
    const fetchCounts = async () => {
      if (!receivedRequests || receivedRequests.length === 0 || !userData) return;

      try {
        const accessToken = await getAccessTokenSilently();
        const requestIds = receivedRequests.map(request => request._id);

        dispatch(fetchMessageCounts({
          requestIds,
          accessToken
        }));
      } catch (error) {
        console.error('Error fetching message counts:', error);
      }
    };

    fetchCounts();
  }, [receivedRequests, getAccessTokenSilently, userData, dispatch]);

  const handleApprove = async (requestId, videoId, toId) => {
    try {
      const accessToken = await getAccessTokenSilently()
      // Extract the correct user ID
      const userId = userData._id || userData.sub || userData.id

      if (!userId) {
        console.error('No valid user ID found in userData:', userData)
        return
      }

      console.log('Approving request:', { requestId, videoId, toId })
      dispatch(approveRequest({
        requestId,
        videoId,
        toId,
        userData: { ...userData, _id: userId },
        accessToken,
        userRole
      }))
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleReject = async (requestId) => {
    try {
      const accessToken = await getAccessTokenSilently()
      console.log('Rejecting request:', requestId)
      dispatch(rejectRequest({
        requestId,
        accessToken
      }))
    } catch (error) {
      console.error('Error rejecting request:', error)
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

  return (
    <div className='rounded-lg border border-gray-200 bg-white shadow-sm min-h-[500px] flex flex-col h-full'>
      <div className='overflow-x-auto flex-1 flex flex-col'>
        <table className='w-full divide-y divide-gray-200 h-full'>
          <thead className='bg-gradient-to-r from-blue-50 to-indigo-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <Film className='mr-2 h-4 w-4 text-indigo-500' />
                  Video Name
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <User className='mr-2 h-4 w-4 text-indigo-500' />
                  Editor Name
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <FileText className='mr-2 h-4 w-4 text-indigo-500' />
                  Description
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <IndianRupee className='mr-2 h-4 w-4 text-indigo-500' />
                  Price
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                <div className='flex items-center'>
                  <MessageSquare className='mr-2 h-4 w-4 text-indigo-500' />
                  Negotiate
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                Action
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white h-full'>
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <tr
                  key={request._id}
                  className='transition-colors duration-150 hover:bg-gray-50'>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='flex items-center'>
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100'>
                        <Film className='h-5 w-5 text-indigo-600' />
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
                          {request.from.name || 'Unknown Editor'}
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
                  <td className='whitespace-nowrap px-6 py-4'>
                    <MessageThread
                      requestId={request._id}
                      onClose={() => setSelectedRequestId(null)}
                      requestStatus={request.status}
                      messageCount={messageCounts[request._id] || 0}
                    />
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-right text-sm'>
                    {request.status === 'pending' && (
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleApprove(request._id, request.video._id, request.from._id)}
                          className='flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100'
                          disabled={loading}>
                          {loading ? (
                            <Clock className='mr-1 h-3 w-3 animate-spin' />
                          ) : (
                            <CheckCircle className='mr-1 h-3 w-3' />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className='flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100'
                          disabled={loading}>
                          {loading ? (
                            <Clock className='mr-1 h-3 w-3 animate-spin' />
                          ) : (
                            <XCircle className='mr-1 h-3 w-3' />
                          )}
                          Reject
                        </button>
                      </div>
                    )}
                    {request.status === 'approved' && (
                      <span className='flex items-center text-xs text-green-600'>
                        <ThumbsUp className='mr-1 h-3 w-3' />
                        Approved
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <span className='flex items-center text-xs text-red-600'>
                        <XCircle className='mr-1 h-3 w-3' />
                        Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className='h-full'>
                <td
                  colSpan='7'
                  className='px-6 py-10 text-center text-sm text-gray-500 h-full'>
                  <div className='flex flex-col items-center justify-center h-full min-h-[300px]'>
                    <FileText className='mb-2 h-10 w-10 text-gray-400' />
                    <p className='font-medium'>No requests found</p>
                    <p className='mt-1 text-xs text-gray-400'>
                      When users send you requests, they will appear here
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

export default ContentTableApprove
