function UserProfile() {
  return (
    <div className='min-w-sm no-scrollbar h-full w-[20rem] overflow-auto rounded-lg border-2 border-blue-300 bg-gray-200 p-4 shadow-xl'>
      {/* Profile Picture */}
      <div className='mb-4 flex items-center justify-center'>
        <img
          src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          alt='Profile'
          className='h-24 w-24 rounded-full border-2 border-blue-300'
        />
      </div>

      {/* Username and Email */}
      <div className='mb-4 text-center'>
        <h2 className='p-3 text-2xl font-semibold text-gray-800'>
          Rishabh Raj
        </h2>
        <p className='text-gray-600'>rishabh@example.com</p>
        <p className='text-gray-600'>Youtube Channel: @RishabhKhelraay</p>
      </div>

      <hr className='mb-4 border-gray-300' />

      {/* Bio Label */}
      <div className='mb-4'>
        <h1 className='flex justify-center'>
          <span className='rounded-full bg-purple-200 px-4 py-1 text-gray-700'>
            Bio
          </span>
        </h1>
      </div>

      {/* Bio Text */}
      <div className='text-center text-gray-600'>
        <p>
          Passionate content creator focused on tech tutorials and gaming.
          Always looking for new ways to connect and share knowledge.
        </p>
      </div>
    </div>
  )
}

export default UserProfile
