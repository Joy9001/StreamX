import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

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
    return <div className='p-4 text-center'>Loading...</div>
  }

  return (
    <>
      <div className='no-scrollbar h-[30rem] overflow-x-auto'>
        <table className='table table-pin-rows'>
          <thead>
            <tr>
              <th>Video Name</th>
              {userRole === 'Owner' ? <th>Editor Name</th> : <th>Owner Name</th>}
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.video.title || 'Loading...'}</td>
                <td>
                  {request.from.name}
                </td>
                <td>{request.description}</td>
                <td>${request.price}</td>
                <td>
                  <span
                    className={`badge ${
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
