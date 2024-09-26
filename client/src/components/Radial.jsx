function Radial() {
  return (
    <div className='bg-gray-200 shadow-xl rounded-lg p-4 w-[20rem] min-w-sm h-full overflow-auto no-scrollbar justify-center flex flex-col items-center border-blue-300 border-2'>
      <div className='flex items-center mb-4'>
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
      <hr className='w-full border-t border-gray-300 my-4' />

      <h2 className='text-xl font-bold mb-2'>Explore our Premium Plans</h2>
      <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-white hover:text-blue-500 hover:border-blue-500 hover:border-2 transition duration-300'>
        Explore Now
      </button>
    </div>
  )
}

export default Radial
