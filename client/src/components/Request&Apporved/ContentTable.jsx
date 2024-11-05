import { allVidState } from '@/states/videoState.js'
import axios from 'axios'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

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
              <th>Request ID</th>
              <th>Name</th>
              <th>Editor</th>
              <th>File size</th>
              <th>Aproval Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* {allVideos.map((video) => (
              <ContentTableRow key={video._id} content={video} />
            ))} */}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ContentTable
