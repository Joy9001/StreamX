import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Clock,
  CheckCircle,
  XCircle,
  Film,
  User,
  DollarSign,
  FileText,
} from 'lucide-react'

function ContentTable() {
  const [requests, setRequests] = useState([])
  const [videoNames, setVideoNames] = useState({})
  const [editorNames, setEditorNames] = useState({})
  const [ownerNames, setOwnerNames] = useState({})
  const userData = useSelector((state) => state.user.userData)
  const { getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState(null)
  const [userRole, setUserRole] = useState(null)

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
    async function fetchRequests() {
      try {
        if (!userRole || !userData?._id) return

        let endpoint = `${import.meta.env.VITE_BACKEND_URL}/requests/from-id/${userData._id}`

        const res = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
        console.log('res in ContentTable', res.data)
        setRequests(res.data)
      } catch (error) {
        console.error('Error fetching requests:', error)
      }
    }

    if (accessToken && userRole) {
      fetchRequests()
    }
  }, [userData, accessToken, userRole])

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
    <div className='rounded-lg border border-gray-200 bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                <div className='flex items-center'>
                  <Film className='mr-2 h-4 w-4 text-gray-400' />
                  Video
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                <div className='flex items-center'>
                  <User className='mr-2 h-4 w-4 text-gray-400' />
                  {userRole === 'Owner' ? 'Editor' : 'Owner'}
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                <div className='flex items-center'>
                  <FileText className='mr-2 h-4 w-4 text-gray-400' />
                  Description
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                <div className='flex items-center'>
                  <DollarSign className='mr-2 h-4 w-4 text-gray-400' />
                  Price
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Status
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
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200'>
                        <Film className='h-5 w-5 text-gray-500' />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {request.video.title || 'Untitled Video'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='text-sm text-gray-900'>
                      {request.from.name}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='max-w-xs truncate text-sm text-gray-900'>
                      {request.description}
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      ${request.price}
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
                    <p>No requests found</p>
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
