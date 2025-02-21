import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

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
        // setRequests((prevRequests) =>
        //   prevRequests.map((req) =>
        //     req._id === requestId ? response.data : req
        //   )
        // )
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

  if (!userRole) {
    return <div className='p-4 text-center'>Loading...</div>
  }

  return (
    <>
      <div className='no-scrollbar h-[30rem] overflow-x-auto'>
        <table className='table table-pin-rows'>
          <thead>
            <tr>
              <th>Video Name</th>
              <th>Editor Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(
              (request) => (
                console.log('Request:', request),
                (
                  <tr key={request._id}>
                    <td>{request.video.title || 'Loading...'}</td>
                    <td>{request.from.name || 'Loading...'}</td>
                    <td>{request.description}</td>
                    <td>${request.price}</td>
                    <td>
                      <span
                        className={`badge ${request.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className='btn btn-success btn-sm'
                        onClick={() =>
                          handleApprove(
                            request._id,
                            request.video._id,
                            request.to.id
                          )
                        }
                        disabled={request.status === 'approved' || loading}>
                        {request.status === 'approved' ? 'Approved' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className='py-8 text-center text-gray-500'>
            No approved requests found
          </div>
        )}
      </div>
    </>
  )
}

export default ContentTableApprove
