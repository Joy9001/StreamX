import { setAllVideos } from '@/store/slices/videoSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ContentTableRow from '../Storage/ContenetTableRow.jsx'

function ContentTable() {
  const allVideos = useSelector((state) => state.video.allVideos)
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchAllVideos() {
      try {
        const res = await axios.get('http://localhost:3000/api/videos/all', {
          withCredentials: true,
        })
        console.log('all', res.data)
        dispatch(setAllVideos(res.data.videos))
      } catch (error) {
        console.error('Error fetching all videos:', error)
      }
    }

    fetchAllVideos()
  }, [dispatch])

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
