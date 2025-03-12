import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CheckCircle,
  Clock,
  XCircle,
  Film,
  User,
  DollarSign,
  FileText,
  ThumbsUp,
} from 'lucide-react'

function ContentTableApprove() {
  const [requests, setRequests] = useState([])
  // const [videoNames, setVideoNames] = useState({})
  // const [editorNames, setEditorNames] = useState({})
  const [loading, setLoading] = useState(false)
  const { getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const userData = useSelector((state) => state.user.userData)

  useEffect(() => {
    // Set user role when userData changes
    if (userData && userData.user_metadata && userData.user_metadata.role) {
      setUserRole(userData.user_metadata.role)
    }
  }, [userData])

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const token = await getAccessTokenSilently()
        setAccessToken(token)
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }
    if (userData && Object.keys(userData).length > 0) {
      fetchAccessToken()
    }
  }, [getAccessTokenSilently, userData])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!userRole || !userData?._id || !accessToken) return

        // Use the editor endpoint to get requests where to_id matches owner's ID
        const endpoint = `${import.meta.env.VITE_BACKEND_URL}/requests/to-id/${userData._id}`
        console.log('Using endpoint:', endpoint)

        const res = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })

        console.log('Owner ID:', userData._id)
        console.log('All requests:', res.data)
        console.log(
          'Request to_ids:',
          res.data.map((req) => req.to_id)
        )
        setRequests(res.data)
      } catch (error) {
        console.error('Error fetching requests:', error)
      }
    }

    fetchRequests()
  }, [userData, accessToken, userRole])

  const handleApprove = async (requestId, videoId, toId) => {
    try {
      setLoading(true)
      // Send PATCH request to update request status
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/requests/${requestId}/status`,
        { status: 'approved' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )

      if (response.data) {
        // Update video ownership
        const videoResponse = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/${videoId}/owner`,
          { owner_id: toId },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )

        console.log('Video ownership updated:', videoResponse.data)

        // Update the local state with the response from the server
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: 'approved' } : req
          )
        )
        console.log('Request approved and video ownership updated successfully')
      }
    } catch (error) {
      console.error(
        'Error approving request or updating video ownership:',
        error
      )
    } finally {
      setLoading(false)
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

  if (!userRole) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex items-center rounded-lg bg-blue-50 p-4 text-blue-800'>
          <Clock className='mr-2 h-5 w-5 animate-spin text-blue-600' />
          <span className='font-medium'>Loading request data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full divide-y divide-gray-200'>
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
                  <DollarSign className='mr-2 h-4 w-4 text-indigo-500' />
                  Price
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                Action
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {requests.length > 0 ? (
              requests.map((request) => (
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
                        <DollarSign className='mr-1 h-3.5 w-3.5' />
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
                    <button
                      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        request.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      }`}
                      onClick={() =>
                        handleApprove(
                          request._id,
                          request.video._id,
                          request.to.id
                        )
                      }
                      disabled={request.status === 'approved' || loading}>
                      {loading ? (
                        <Clock className='mr-2 h-4 w-4 animate-spin' />
                      ) : request.status === 'approved' ? (
                        <CheckCircle className='mr-2 h-4 w-4' />
                      ) : (
                        <ThumbsUp className='mr-2 h-4 w-4' />
                      )}
                      {request.status === 'approved' ? 'Approved' : 'Approve'}
                    </button>
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
                      When you receive requests, they will appear here
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
