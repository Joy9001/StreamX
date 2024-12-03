import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function ContentTableApprove() {
  const [requests, setRequests] = useState([])
  const [videoNames, setVideoNames] = useState({})
  const [editorNames, setEditorNames] = useState({})
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
        if (!userRole || !userData?._id || !accessToken) return;

        // Use the editor endpoint to get requests where to_id matches owner's ID
        const endpoint = `${import.meta.env.VITE_BACKEND_URL}/requests/editor/${userData._id}`
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
        console.log('Request to_ids:', res.data.map(req => req.to_id))
        
        // Filter requests where to_id matches owner's _id
        const filteredRequests = res.data.filter(request => {
          console.log('Comparing:', {
            requestToId: request.to_id,
            ownerID: userData._id,
            matches: request.to_id === userData._id
          })
          return request.to_id === userData._id
        })
        
        console.log('Filtered requests:', filteredRequests)
        setRequests(filteredRequests)

        // Fetch video names for filtered requests
        const videoNamesMap = {}
        await Promise.all(
          filteredRequests.map(async (request) => {
            if (!request.video_id) return;
            try {
              const videoRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/videos/name/${request.video_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              )
              videoNamesMap[request.video_id] = videoRes.data.name
            } catch (error) {
              console.error('Error fetching video name:', error)
              videoNamesMap[request.video_id] = 'Unknown Video'
            }
          })
        )
        setVideoNames(videoNamesMap)

        // Fetch editor names using from_id
        const editorNamesMap = {}
        await Promise.all(
          filteredRequests.map(async (request) => {
            try {
              const editorRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/editorProfile/name/${request.from_id}`,
                {
                  withCredentials: true
                }
              )
              editorNamesMap[request.from_id] = editorRes.data.name
            } catch (error) {
              console.error('Error fetching editor name:', error)
              editorNamesMap[request.from_id] = 'Unknown Editor'
            }
          })
        )
        setEditorNames(editorNamesMap)
      } catch (error) {
        console.error('Error fetching requests:', error)
      }
    }

    fetchRequests()
  }, [userData, accessToken, userRole])

  const handleApprove = async (requestId) => {
    try {
      setLoading(true)
      // Send PATCH request to update status
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

      // Update local state only if backend update was successful
      if (response.data) {
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req._id === requestId ? response.data : req
          )
        )
        console.log('Request approved successfully:', response.data)
      }
    } catch (error) {
      console.error('Error approving request:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userRole) {
    return <div className="text-center p-4">Loading...</div>
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
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{videoNames[request.video_id] || 'Loading...'}</td>
                <td>
                  {editorNames[request.from_id] || 'Loading...'}
                </td>
                <td>{request.description}</td>
                <td>${request.price}</td>
                <td>
                  <span className={`badge ${request.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleApprove(request._id)}
                    disabled={request.status === 'approved' || loading}
                  >
                    {request.status === 'approved' ? 'Approved' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No approved requests found
          </div>
        )}
      </div>
    </>
  )
}

export default ContentTableApprove
