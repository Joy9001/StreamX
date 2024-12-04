import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function EditorContentTableApprove() {
  const [requests, setRequests] = useState([])
  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(false)
  const { getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState(null)
  const { userData } = useSelector((state) => state.user)

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently()
        setAccessToken(token)
      } catch (error) {
        console.error('Error getting access token:', error)
      }
    }
    getToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!accessToken || !userData?._id) return

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/requests/from-id/${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )
        console.log('Fetched requests:', response.data)
        setRequests(response.data)
      } catch (error) {
        console.error('Error fetching requests:', error)
      }
    }

    if (accessToken && userData) {
      fetchRequests()
    }
  }, [userData, accessToken])

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        if (!accessToken || !userData?._id) return

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/requests/to-id/${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )
        console.log('Fetched approvals:', response.data)
        setApprovals(response.data)
      } catch (error) {
        console.error('Error fetching approvals:', error)
      }
    }

    if (accessToken && userData) {
      fetchApprovals()
    }
  }, [userData, accessToken])

  const handleApprove = async (requestId, videoId) => {
    try {
      setLoading(true)
      const request = requests.find((req) => req._id === requestId)
      console.log('Processing request:', request)
      console.log('Starting approval process for editor:', {
        requestId,
        videoId,
        editorId: userData._id,
        currentRequest: request,
      })

      // First update request status
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
        console.log('Request status updated:', response.data)

        // Then update video editor
        const videoResponse = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/${videoId}/editor`,
          {
            editorId: userData._id,
            editorAccess: true,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )

        if (videoResponse.data) {
          console.log('Video editor updated:', videoResponse.data)
          // Update local state to reflect both changes
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === requestId
                ? {
                    ...req,
                    status: 'approved',
                    video: {
                      ...req.video,
                      editorId: userData._id,
                      editorAccess: true,
                    },
                  }
                : req
            )
          )
        }
      }
    } catch (error) {
      console.error(
        'Error in handleApprove:',
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto px-4'>
      <div className='overflow-x-auto'>
        <table className='table w-full'>
          <thead>
            <tr>
              <th>Video Name</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((approval) => (
              <tr key={approval._id}>
                <td>{approval.video_name}</td>
                <td>{approval.from_name}</td>
                <td>{approval.to_name}</td>
                <td>{approval.status}</td>
                <td>
                  <button
                    className='btn btn-success btn-sm'
                    onClick={() =>
                      handleApprove(approval._id, approval.video_id)
                    }
                    disabled={approval.status === 'approved' || loading}>
                    {approval.status === 'approved' ? 'Approved' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EditorContentTableApprove
