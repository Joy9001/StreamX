function YtRetryBtn() {
  return (
    <button className='btn no-animation border-black bg-white text-black hover:border-black hover:text-black'>
      <svg
        className='h-5 w-5'
        viewBox='0 0 48 48'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
        <g
          id='SVGRepo_tracerCarrier'
          strokeLinecap='round'
          strokeLinejoin='round'></g>
        <g id='SVGRepo_iconCarrier'>
          {' '}
          <rect
            width='48'
            height='48'
            fill='white'
            fillOpacity='0.01'></rect>{' '}
          <path
            d='M36.7279 36.7279C33.4706 39.9853 28.9706 42 24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6C28.9706 6 33.4706 8.01472 36.7279 11.2721C38.3859 12.9301 42 17 42 17'
            stroke='#000000'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'></path>{' '}
          <path
            d='M42 8V17H33'
            stroke='#000000'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'></path>{' '}
        </g>
      </svg>
      Retry
    </button>
  )
}

export default YtRetryBtn
