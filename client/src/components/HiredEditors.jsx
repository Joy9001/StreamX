function HiredEditors() {
  return (
    <div className='bg-gray-200 shadow-xl rounded-lg p-4 w-[20rem] min-w-sm h-full overflow-auto no-scrollbar flex flex-col border-blue-300 border-2'>
      {/* Title and View All Link */}
      <div className='flex justify-between items-center p-3'>
        <div className='text-2xl p-2 hover:bg-primary duration-300 rounded-xl'>
          Hired Editors
        </div>
        <a className='link p-3'>View All</a>
      </div>
      <hr className='p-3' />

      {/* Editor Profile */}
      <div className='flex justify-between items-center p-2 mt-4'>
        <img
          src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          alt='Editor Profile'
          className='w-12 h-12 rounded-full'
        />
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold'>Rishabh Raj</h1>
          <p className='text-sm text-gray-600'>rishabh@gmail.com</p>
        </div>
        <div className='text-lg font-bold'>$10,000</div>
      </div>
      <hr className='p-3 border-gray-300' />
      <div className='flex justify-between items-center p-2 mt-4'>
        <img
          src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          alt='Editor Profile'
          className='w-12 h-12 rounded-full'
        />
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold'>Rishabh Raj</h1>
          <p className='text-sm text-gray-600'>rishabh@gmail.com</p>
        </div>
        <div className='text-lg font-bold'>$10,000</div>
      </div>
      <hr className='p-3 border-gray-300' />
      <div className='flex justify-between items-center p-2 mt-4'>
        <img
          src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          alt='Editor Profile'
          className='w-12 h-12 rounded-full'
        />
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold'>Rishabh Raj</h1>
          <p className='text-sm text-gray-600'>rishabh@gmail.com</p>
        </div>
        <div className='text-lg font-bold'>$10,000</div>
      </div>
    </div>
  )
}

export default HiredEditors
