import axios from 'axios'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import { allVidState, recentVidState } from '../states/videoState'

function ContenetTableRowOptions({ editor, videoId }) {
  const setRecentVideos = useRecoilState(recentVidState)[1]
  const setAllVideos = useRecoilState(allVidState)[1]
  async function handleDelete() {
    try {
      const res = await axios.delete(
        'http://localhost:3000/api/videos/delete',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            id: videoId,
          },
        }
      )
      console.log(res)
      setRecentVideos((prev) => prev.filter((video) => video._id !== videoId))
      setAllVideos((prev) => prev.filter((video) => video._id !== videoId))
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

ContenetTableRowOptions.propTypes = {
  editor: PropTypes.string,
  videoId: PropTypes.string,
}

export default ContenetTableRowOptions
