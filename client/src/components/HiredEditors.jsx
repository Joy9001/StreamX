function HiredEditors() {
  return (
    <div className='min-w-sm no-scrollbar flex h-full w-[20rem] flex-col overflow-auto rounded-lg border-2 border-blue-300 bg-gray-200 p-4 shadow-xl'>
      {/* Title and View All Link */}
      <div className='flex items-center justify-between p-3'>
        <div className='rounded-xl p-2 text-2xl duration-300 hover:bg-primary'>
          Hired Editors
        </div>
        <a className='link p-3'>View All</a>
      </div>
      <hr className='p-3' />

      {/* Editor Profile */}
      <div className='mt-4 flex items-center justify-between p-2'>
        <img
          src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          alt='Editor Profile'
          className='h-12 w-12 rounded-full'
        />
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold'>Rishabh Raj</h1>
          <p className='text-sm text-gray-600'>rishabh@gmail.com</p>
        </div>
        <div className='text-lg font-bold'>$10,000</div>
      </div>
      <hr className='border-gray-300 p-3' />
      <div className='mt-4 flex items-center justify-between p-2'>
        <img
          src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          alt='Editor Profile'
          className='h-12 w-12 rounded-full'
        />
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold'>Rishabh Raj</h1>
          <p className='text-sm text-gray-600'>rishabh@gmail.com</p>
        </div>
        <div className='text-lg font-bold'>$10,000</div>
      </div>
      <hr className='border-gray-300 p-3' />
      <div className='mt-4 flex items-center justify-between p-2'>
        <img
          src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          alt='Editor Profile'
          className='h-12 w-12 rounded-full'
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
