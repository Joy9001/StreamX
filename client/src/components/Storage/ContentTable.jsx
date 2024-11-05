import { allVidState } from '@/states/videoState.js'
import axios from 'axios'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import ContentTableRow from './ContenetTableRow'
import { YTVideoUploadForm } from './YTVideoUploadForm'

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
