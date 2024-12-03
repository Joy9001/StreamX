import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function ContentTable() {
  const [requests, setRequests] = useState([])
  const [videoNames, setVideoNames] = useState({})
  const [editorNames, setEditorNames] = useState({})
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
        if (!userRole || !userData?._id) return;

        let endpoint = `${import.meta.env.VITE_BACKEND_URL}/requests`
        
        // If user is owner, get requests by from_id
        if (userRole === 'Owner') {
          endpoint = `${import.meta.env.VITE_BACKEND_URL}/requests/owner/${userData._id}`
        }
        // If user is editor, get requests by to_id
        else if (userRole === 'Editor') {
          endpoint = `${import.meta.env.VITE_BACKEND_URL}/requests/editor/${userData._id}`
        }

        const res = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
        setRequests(res.data)

        // Fetch video names for all requests
        const videoNamesMap = {}
        await Promise.all(
          res.data.map(async (request) => {
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

        // Fetch editor names for all requests (if user is owner)
        if (userRole === 'Owner') {
          const editorNamesMap = {}
          await Promise.all(
            res.data.map(async (request) => {
              if (!request.to_id) return;
              try {
                const editorRes = await axios.get(
                  `${import.meta.env.VITE_BACKEND_URL}/editorProfile/name/${request.to_id}`,
                  {
                    withCredentials: true
                  }
                )
                editorNamesMap[request.to_id] = editorRes.data.name
              } catch (error) {
                console.error('Error fetching editor name:', error)
                editorNamesMap[request.to_id] = 'Unknown Editor'
              }
            })
          )
          setEditorNames(editorNamesMap)
        }
      } catch (error) {
        console.error('Error fetching requests:', error)
      }
    }

    if (accessToken && userRole) {
      fetchRequests()
    }
  }, [userData, accessToken, userRole])

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
              {userRole === 'Owner' ? <th>Editor Name</th> : <th>From ID</th>}
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{videoNames[request.video_id] || 'Loading...'}</td>
                <td>
                  {userRole === 'Owner'
                    ? editorNames[request.to_id] || 'Loading...' // Show editor name for owner
                    : request.from_id} {/* Show from_id for editor */}
                </td>
                <td>{request.description}</td>
                <td>${request.price}</td>
                <td>
                  <span className={`badge ${
                    request.status === 'approved'
                      ? 'badge-success'
                      : request.status === 'rejected'
                      ? 'badge-error'
                      : 'badge-warning'
                  }`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ContentTable
