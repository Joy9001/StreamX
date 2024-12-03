import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'

function EditorContentTableApprove() {
  const [requests, setRequests] = useState([])
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
          `${import.meta.env.VITE_BACKEND_URL}/requests/editor/${userData._id}`,
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

  const handleApprove = async (requestId, videoId) => {
    try {
      setLoading(true)
      const request = requests.find(req => req._id === requestId)
      console.log('Processing request:', request)
      console.log('Starting approval process for editor:', {
        requestId,
        videoId,
        editorId: userData._id,
        currentRequest: request
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
            editorAccess: true
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
          setRequests(prevRequests =>
            prevRequests.map(req =>
              req._id === requestId 
                ? { 
                    ...req, 
                    status: 'approved',
                    video: { 
                      ...req.video, 
                      editorId: userData._id,
                      editorAccess: true
                    }
                  } 
                : req
            )
          )
        }
      }
    } catch (error) {
      console.error('Error in handleApprove:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="overflow-x-auto">
        <table className="table w-full">
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
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.video_name}</td>
                <td>{request.from_name}</td>
                <td>{request.to_name}</td>
                <td>{request.status}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleApprove(request._id, request.video_id)}
                    disabled={request.status === 'approved' || loading}
                  >
                    {request.status === 'approved' ? 'Approved' : 'Approve'}
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
