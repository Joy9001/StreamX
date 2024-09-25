import storageIcon from '../assets/storage.svg'

function StorageNav() {
  return (
    <div className='storage-nav navbar bg-base-100'>
      <div className='flex-1'>
        <span className='flex space-x-2'>
          <span className='storage-icon flex items-center justify-center'>
            <img src={storageIcon} alt='storage-icon' />
          </span>
          <span className='flex items-center justify-center text-xl font-bold'>
            Storage
          </span>
        </span>
      </div>
      <div className='flex flex-none items-center gap-2'>
        <div className='form-control'>
          <label className='input input-sm input-bordered input-primary flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'>
              <path
                fillRule='evenodd'
                d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                clipRule='evenodd'
              />
            </svg>
            <input type='text' className='grow' placeholder='Search' />
          </label>
        </div>
        <div className='dropdown dropdown-end'>
          <div
            tabIndex={0}
            role='button'
            className='avatar btn btn-circle btn-ghost'>
            <div className='w-10 rounded-full'>
              <img
                alt='Tailwind CSS Navbar component'
                src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className='menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow'>
            <li>
              <a className='justify-between'>Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StorageNav