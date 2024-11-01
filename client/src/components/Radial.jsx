function Radial() {
  return (
    <div className='min-w-sm no-scrollbar flex h-full w-[20rem] flex-col items-center justify-center overflow-auto rounded-lg border-2 border-blue-300 bg-gray-200 p-4 shadow-xl'>
      <div className='mb-4 flex items-center'>
        <div
          className='radial-progress'
          style={{ '--value': 70 }}
          role='progressbar'>
          70%
        </div>
        <div className='ml-4'>
          <p className='text-lg font-semibold'>Storage Remaining:</p>
          <p className='text-gray-600'>3GB Out of 10GB</p>{' '}
          {/* Adjust storage value as needed */}
        </div>
      </div>

      {/* Separator */}
      <hr className='my-4 w-full border-t border-gray-300' />

      <h2 className='mb-2 text-xl font-bold'>Explore our Premium Plans</h2>
      <button className='rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:border-2 hover:border-blue-500 hover:bg-white hover:text-blue-500'>
        Explore Now
      </button>
    </div>
  )
}

export default Radial
