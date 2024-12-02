import { setAllVideos } from '@/store/slices/videoSlice'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ContentTableRow from './ContenetTableRow.jsx'
import { YTVideoUploadForm } from './YTVideoUploadForm'
function ContentTable() {
  const allVideos = useSelector((state) => state.video.allVideos)
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const token = await getAccessTokenSilently()
        setAccessToken(token)
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }
    fetchAccessToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    async function fetchAllVideos() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/videos/all`,
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

    fetchAllVideos()
  }, [dispatch, accessToken])

  return (
    <>
      <div className='no-scrollbar h-[30rem] overflow-x-auto'>
        <table className='table table-pin-rows'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Editor</th>
              <th>Last Modified</th>
              <th>File size</th>
              <th>YT Status</th>
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

        <dialog id='my_modal_3' className='modal'>
          <div className='modal-box h-[90%] w-[50%] max-w-none'>
            <form method='dialog'>
              <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>
                ✕
              </button>
            </form>
            {/* <h3 className='text-lg font-bold'>Hello!</h3>
            <p className='py-4'>Press ESC key or click on ✕ button to close</p> */}
            <YTVideoUploadForm />
          </div>
        </dialog>
      </div>
    </>
  )
}

export default ContentTable
