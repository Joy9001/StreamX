import { setAllVideos } from '@/store/slices/videoSlice'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ContentTableRow from '../Storage/ContenetTableRow.jsx'

function ContentTable() {
  const allVideos = useSelector((state) => state.video.allVideos)
  const userData = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const token = await getAccessTokenSilently({
          cacheMode: 'on',
        })
        setAccessToken(token)
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }
    if (JSON.stringify(userData) !== '{}') fetchAccessToken()
  }, [getAccessTokenSilently, accessToken, userData])

  useEffect(() => {
    async function fetchAllVideos() {
      try {
        // console.log('Fetching all videos...', userData._id)
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/all/${userData.user_metadata.role}/${userData._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        )
        console.log('all', res.data)
        dispatch(setAllVideos(res.data.videos))
      } catch (error) {
        console.error('Error fetching all videos:', error)
      }
    }

    if (JSON.stringify(userData) !== '{}') fetchAllVideos()
  }, [dispatch, accessToken, userData])

  return (
    <>
      <div className='no-scrollbar h-[30rem] overflow-x-auto'>
        <table className='table table-pin-rows'>
          {/* head */}
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Name</th>
              <th>Editor</th>
              <th>File size</th>
              <th>Aproval Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allVideos.map((video) => (
              <ContentTableRow key={video._id} content={video} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ContentTable
