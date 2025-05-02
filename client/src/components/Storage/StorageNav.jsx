import { HardDrive } from 'lucide-react'

function StorageNav() {
  return (
    <div className='storage-nav navbar bg-base-100'>
      <div className='flex-1'>
        <span className='flex space-x-2'>
          <span className='storage-icon flex items-center justify-center'>
            <HardDrive className='h-6 w-6' />
          </span>
          <span className='flex items-center justify-center text-xl font-bold'>
            Storage
          </span>
        </span>
      </div>
      {/* <div className='flex flex-none items-center gap-2'>
        <div className='form-control'>
          <label className='input input-md input-bordered input-primary flex w-60 items-center gap-2'>
            <Search className='h-4 w-4 opacity-70' />
            <input type='text' className='grow' placeholder='Search' />
          </label>
        </div>
      </div> */}
    </div>
  )
}

export default StorageNav
