import axios from 'axios'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { allVidState } from '../states/videoState.js'
import ContentTableRow from './ContenetTableRow'

function ContentTable() {
  const [allVideos, setAllVideos] = useRecoilState(allVidState)

  useEffect(() => {
    async function fetchAllVideos() {
      try {
        const res = await axios.get('http://localhost:3000/api/videos/all', {
          withCredentials: true,
        })
        console.log('all', res.data)
        setAllVideos(res.data.videos)
      } catch (error) {
        console.error('Error fetching all videos:', error)
      }
    }

    fetchAllVideos()
  }, [setAllVideos])

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
      </div>
    </>
  )
}

export default ContentTable
