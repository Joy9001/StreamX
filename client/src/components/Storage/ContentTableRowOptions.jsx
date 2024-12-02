import { useDispatch, useSelector } from 'react-redux'
import { setRecentVideos, setAllVideos } from '@/store/slices/videoSlice'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

function ContentTableRowOptions({ editor, videoId }) {
  const dispatch = useDispatch()
  const recentVideos = useSelector((state) => state.video.recentVideos)
  const allVideos = useSelector((state) => state.video.allVideos)
  const [accessToken, setAccessToken] = useState(null)
  const { getAccessTokenSilently } = useAuth0()

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

  async function handleDelete() {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/videos/delete`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
          data: {
            id: videoId,
          },
        }
      )
      console.log(res)
      dispatch(
        setRecentVideos(recentVideos.filter((video) => video._id !== videoId))
      )
      dispatch(setAllVideos(allVideos.filter((video) => video._id !== videoId)))
      alert(res.data.message)
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Failed to delete video!')
    }
  }

  return (
    <>
      <div className='dropdown dropdown-end'>
        <div
          tabIndex={0}
          role='button'
          className='btn btn-circle btn-sm m-1 border-none bg-transparent shadow-none'>
          <svg
            viewBox='0 0 16 16'
            xmlns='http://www.w3.org/2000/svg'
            fill='#000000'
            className='bi bi-three-dots-vertical h-4 w-4'>
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'></path>{' '}
            </g>
          </svg>
        </div>
        <ul
          tabIndex={0}
          className='menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 font-semibold shadow'>
          <li className=''>
            <a>{editor ? 'Revoke Editor' : 'Assign Editor'}</a>
          </li>
          <hr className='my-1 border-neutral-200' />
          <li className='*:text-red-500' onClick={handleDelete}>
            <a>Delete</a>
          </li>
        </ul>
      </div>
    </>
  )
}

ContentTableRowOptions.propTypes = {
  editor: PropTypes.string,
  videoId: PropTypes.string,
}

export default ContentTableRowOptions
