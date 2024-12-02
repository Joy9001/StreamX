import keySvg from '@/assets/key.svg'
import userCircle from '@/assets/user-circle.svg'
import { filesize } from 'filesize'
import { useState } from 'react'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerOpen } from '@/store/slices/uiSlice'

const VideoDrawer = () => {
  const [light, setLight] = useState(
    'https://via.placeholder.com/150x150.png?text=&bg=ffffff&shadow=true'
  )

  const dispatch = useDispatch()
  const drawerContent = useSelector((state) => state.ui.drawerContent)

  // console.log('drawerContent', drawerContent)
  function handleCrossClick() {
    dispatch(setDrawerOpen(false))
  }

  return drawerContent ? (
    <div className='no-scrollbar w-full overflow-auto rounded-lg bg-neutral-50 p-4'>
      <header className='flex items-center justify-between'>
        <h2 className='text-md font-semibold'>{drawerContent.metaData.name}</h2>
        <span
          className='material-symbols-outlined cursor-pointer'
          onClick={handleCrossClick}>
          <svg
            className='h-6 w-6'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <g id='Menu / Close_SM'>
                {' '}
                <path
                  id='Vector'
                  d='M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16'
                  stroke='#000000'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'></path>{' '}
              </g>{' '}
            </g>
          </svg>
        </span>
      </header>

      <figure className='mt-6 w-full'>
        <ReactPlayer
          className='react-player flex h-32 w-full overflow-hidden rounded-lg object-cover'
          width='100%'
          height='8rem'
          url={drawerContent.url}
          light={light}
          controls={true}
          onReady={() => setLight(true)}
        />
      </figure>

      <section className='mt-6'>
        <h3 className='text-md mb-3 font-semibold'>Editor with access</h3>
        <div className='mb-4 flex items-center gap-2'>
          <div className='avatar'>
            <div className='w-10 rounded-full'>
              <img
                src={drawerContent.editorPic || userCircle}
                alt={drawerContent.editor || 'editor'}
              />
            </div>
          </div>
        </div>

        <button className='btn btn-primary text-black'>
          <img src={keySvg} alt='key' className='h-4 w-4' />
          Manage Access
        </button>
      </section>

      <hr className='my-6 border-neutral-200' />

      <section>
        <h3 className='text-md mb-4 font-semibold'>File details</h3>
        <div className='flex flex-col gap-3 text-sm'>
          <div>
            <span className='font-medium'>Location</span>
            <p>{drawerContent.location || 'Storage'}</p>
          </div>
          <div>
            <span className='font-medium'>Type</span>
            <p>{drawerContent.metaData.contentType}</p>
          </div>
          <div>
            <span className='font-medium'>Size</span>
            <p>{filesize(drawerContent.metaData.size)}</p>
          </div>
          <div>
            <span className='flex items-center'>
              <span className='font-medium'>Owner</span>
              <div className='avatar'>
                <div className='ml-2 w-8 rounded-full'>
                  <img
                    src={drawerContent.ownerPic || userCircle}
                    alt={drawerContent.owner || 'owner'}
                  />
                </div>
              </div>
              <span className='ml-2'>{drawerContent.owner || '-'}</span>
            </span>
          </div>
          <div>
            <span className='font-medium'>Modified</span>
            <p>
              {new Date(drawerContent.updatedAt).toLocaleString()} by{' '}
              {drawerContent.owner || '-'}
            </p>
          </div>
          <div>
            <span className='font-medium'>Created</span>
            <p>{new Date(drawerContent.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </section>

      <hr className='my-4 border-neutral-200' />

      <section>
        <h3 className='text-md mb-4 font-semibold'>Status</h3>
        <div className='flex flex-col text-sm'>
          <span className='font-medium'>Youtube Upload Status</span>
          <span className=''>
            {drawerContent.ytUploadStatus == 'None'
              ? '-'
              : drawerContent.ytStatus}
          </span>
        </div>
        <div className='flex flex-col text-sm'>
          <span className='font-medium'>Approve Status</span>
          <span className=''>
            {drawerContent.approvalStatus == 'None'
              ? '-'
              : drawerContent.approvalStatus}
          </span>
        </div>
      </section>
    </div>
  ) : (
    <></>
  )
}

export default VideoDrawer
