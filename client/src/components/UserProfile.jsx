function UserProfile() {
  return (
    <div className='bg-gray-200 shadow-xl rounded-lg p-4 w-[20rem] min-w-sm h-full overflow-auto no-scrollbar border-blue-300 border-2'>
      {/* Profile Picture */}
      <div className='flex items-center justify-center mb-4'>
        <img
          src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
          alt='Profile'
          className='w-24 h-24 rounded-full border-2 border-blue-300'
        />
      </div>

      {/* Username and Email */}
      <div className='text-center mb-4'>
        <h2 className='text-2xl font-semibold text-gray-800 p-3'>
          Rishabh Raj
        </h2>
        <p className='text-gray-600'>rishabh@example.com</p>
        <p className='text-gray-600'>Youtube Channel: @RishabhKhelraay</p>
      </div>

      <hr className='border-gray-300 mb-4' />

      {/* Bio Label */}
      <div className='mb-4'>
        <h1 className='flex justify-center'>
          <span className='bg-purple-200 text-gray-700 py-1 px-4 rounded-full'>
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
