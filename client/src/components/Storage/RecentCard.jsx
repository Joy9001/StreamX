import PropTypes from 'prop-types'
import { useState } from 'react'
import ReactPlayer from 'react-player'

function RecentCard({ video }) {
  const [light, setLight] = useState(
    'https://via.placeholder.com/150x150.png?text=&bg=ffffff&shadow=true'
  )
  return (
    <>
      <div className='card my-2 mr-4 min-w-56 max-w-56 border-2 border-solid border-neutral bg-base-100 shadow-md'>
        <div className='ml-2 flex items-center p-2 text-center'>
          <div className='vid-icon flex items-center justify-center'>
            <svg
              className='h-5 w-5'
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
                <path
                  d='M14.7295 2H9.26953V6.36H14.7295V2Z'
                  fill='#70acc7'></path>{' '}
                <path
                  d='M16.2305 2V6.36H21.8705C21.3605 3.61 19.3305 2.01 16.2305 2Z'
                  fill='#70acc7'></path>{' '}
                <path
                  d='M2 7.85938V16.1894C2 19.8294 4.17 21.9994 7.81 21.9994H16.19C19.83 21.9994 22 19.8294 22 16.1894V7.85938H2ZM14.44 16.1794L12.36 17.3794C11.92 17.6294 11.49 17.7594 11.09 17.7594C10.79 17.7594 10.52 17.6894 10.27 17.5494C9.69 17.2194 9.37 16.5394 9.37 15.6594V13.2594C9.37 12.3794 9.69 11.6994 10.27 11.3694C10.85 11.0294 11.59 11.0894 12.36 11.5394L14.44 12.7394C15.21 13.1794 15.63 13.7994 15.63 14.4694C15.63 15.1394 15.2 15.7294 14.44 16.1794Z'
                  fill='#70acc7'></path>{' '}
                <path
                  d='M7.76891 2C4.66891 2.01 2.63891 3.61 2.12891 6.36H7.76891V2Z'
                  fill='#70acc7'></path>{' '}
              </g>
            </svg>
          </div>
          <span className='ml-3 truncate text-sm font-medium'>
            {video ? video.metaData.name : 'dummy.mp4'}
          </span>
        </div>
        <figure className='m-2 flex h-32 items-center justify-center rounded-xl shadow-inner'>
          <ReactPlayer
            className='react-player flex h-32 w-full overflow-hidden rounded object-cover'
            width='100%'
            height='8rem'
            url={
              video
                ? video.url
                : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
            }
            light={light}
            controls={true}
            onReady={() => setLight(true)}
          />
        </figure>
      </div>
    </>
  )
}

RecentCard.propTypes = {
  video: PropTypes.object,
}

export default RecentCard
